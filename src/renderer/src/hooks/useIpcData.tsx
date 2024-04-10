import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'
import { objectToQueryString } from '@renderer/utils'

interface Props {
  method: 'get' | 'post'
  path: string | undefined
  params?: JSONValue
  swrConf?: SWRConfiguration
}
/**
 * @description: 设置Ipc数据(主进程)
 * @param {type} method 请求方式
 * @param {type} path 请求地址
 * @param {type} params 请求参数
 * @param {type} swrConf SWR 设置
 * @return {type}
 */
export const useIpcData = ({
  method = 'get',
  path,
  params = {},
  swrConf = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  }
}: Props) => {
  const { data, mutate, isLoading, isValidating, error } = useSWR<
    DataType<ResponseDataListType | ItemType>
  >(
    path,
    async (path: string) => {
      const res = await window.ipcRenderer.invoke('request', {
        url: method === 'get' ? `${path}?${objectToQueryString(params)}` : path,
        method: method === 'get' ? 'GET' : 'POST'
      })

      return res
    },
    swrConf
  )

  return {
    data,
    mutate,
    isLoading,
    isValidating,
    error
  }
}
