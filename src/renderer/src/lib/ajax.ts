import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useLoadingStore } from '@renderer/stores'

// 静态配置项直接用 defaults 配置
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 10000

// 动态配置项用拦截器来配置
axios.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  return config
})

type Options = {
  showLoading?: boolean
  handleError?: boolean
}
export const useAjax = (options?: Options) => {
  const table: Record<string, undefined | (() => void)> = {
    401: () => {
      console.log('401')
    },
    402: () => {
      console.log('402')
    },
    403: () => {
      console.log('403')
    },
    unknown: () => {
      console.log('unknown')
    }
  }
  const showLoading = options?.showLoading || false
  const handleError = options?.handleError ?? true
  const { setLoadingOpen } = useLoadingStore()
  const onError = (error: AxiosError) => {
    if (error.response) {
      if (handleError) {
        const { status } = error.response
        const fn = table[status] || table.unknown
        fn?.()
      }
    }
    throw error
  }
  const ajax = {
    get: <T>(path: string, config?: AxiosRequestConfig<any>) => {
      return axios.get<T>(path, config).catch(onError)
    },
    post: <T>(path: string, data: JSONValue) => {
      if (showLoading) {
        setLoadingOpen(true)
      }
      return axios
        .post<T>(path, data)
        .catch(onError)
        .finally(() => {
          if (showLoading) {
            setLoadingOpen(false)
          }
        })
    },
    patch: () => {},
    delete: () => {}
  }
  return ajax
}
