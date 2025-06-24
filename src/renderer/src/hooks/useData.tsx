import { useAjax } from '@renderer/lib/ajax'
import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'

interface Props {
  method: 'GET' | 'POST'
  path: string | undefined
  params?: JSONValue
  swrConf?: SWRConfiguration
}
/**
 * @description: 设置数据
 * @param {type} method 请求方式
 * @param {type} path 请求地址
 * @param {type} params 请求参数
 * @param {type} swrConf SWR 设置
 * @return {type}
 * @example
 * const { data, mutate, isLoading, isValidating, error } = useData({
 *   method: 'GET',
 *   path: '/api/test/list',
 *   params: { count: 10 }
 * })
 */
export const useData = ({
  method = 'GET',
  path,
  params = {},
  swrConf = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
}: Props) => {
  const { get, post } = useAjax({ showLoading: true, handleError: true })
  const { data, mutate, isLoading, isValidating, error } = useSWR<
    DataType<ResponseDataListType | ItemType>
  >(
    path,
    async (path: string) => {
      try {
        const res =
          method === 'GET'
            ? await get<DataType<ResponseDataListType | ItemType>>(path, {
                params,
              })
            : await post<DataType<ResponseDataListType | ItemType>>(
                path,
                params
              )

        return res.data
      } catch (error) {
        console.error('请求失败:', error)
        // 重新抛出错误，让SWR处理
        throw error
      }
    },
    swrConf
  )

  return {
    data,
    mutate,
    isLoading,
    isValidating,
    error,
  }
}
