import React, { useEffect, useState } from 'react'

import { useIpcData } from '@renderer/hooks/useIpcData'
import { useTitle } from '@renderer/hooks/useTitle'
import { useIpcAjax } from '@renderer/lib/ipc-ajax'
import { Button } from 'antd'

type Props = {
  title?: string
}
/**
 * HTTP 客户端使用示例组件
 * 演示如何使用类似 useAjax 的方式进行网络请求
 */
export const RequestPage: React.FC<Props> = props => {
  if (props.title) {
    useTitle(props.title)
  }
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: getIpcData } = useIpcData({
    method: 'GET',
    path: `https://www.dongchedi.com/motor/pc/car/series/car_list`,
    params: {
      aid: 1839,
      app_name: 'auto_web_pc',
      city_name: '重庆',
      series_id: 99,
    },
  })
  useEffect(() => {
    if (getIpcData) console.log('getIpcData', getIpcData)
  }, [getIpcData])

  const { data: postIpcData } = useIpcData({
    method: 'POST',
    path: `https://www.dongchedi.com/motor/pc/car/brand/select_series_v2`,
    params: {
      aid: 1839,
      app_name: 'auto_web_pc',
      sort_new: 'hot_new',
      city_name: '重庆',
      brand: 2,
    },
  })
  useEffect(() => {
    if (postIpcData) console.log('postIpcData', postIpcData)
  }, [postIpcData])

  // 使用 HTTP 客户端，配置加载状态和错误处理
  const { get, post } = useIpcAjax({
    showLoading: true,
    handleError: true,
  })

  // GET 请求示例
  const handleGet = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await get(
        'https://www.dongchedi.com/motor/pc/car/series/car_list?aid=1839&app_name=auto_web_pc&city_name=重庆&series_id=99'
      )
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }

  // POST 请求示例
  const handlePost = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await post(
        'https://www.dongchedi.com/motor/pc/car/brand/select_series_v2',
        {
          aid: 1839,
          app_name: 'auto_web_pc',
          sort_new: 'hot_new',
          city_name: '重庆',
          brand: 2,
        }
      )
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="request-page h-[calc(100vh-46px)] overflow-y-auto p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        HTTP 客户端使用示例
      </h2>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={handleGet}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          GET 请求
        </Button>
        <Button
          onClick={handlePost}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          POST 请求
        </Button>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
          <p className="text-blue-700">请求中...</p>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700">错误: {error}</p>
        </div>
      )}

      {/* 响应结果 */}
      {response && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            响应结果:
          </h3>
          <div className="bg-white p-3 rounded border overflow-auto max-h-96">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">使用说明:</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• 这个 HTTP 客户端提供了类似 useAjax 的使用方式</p>
          <p>• 支持 GET、POST 等 HTTP 方法</p>
          <p>• 可以配置是否显示加载状态和错误处理</p>
          <p>• 所有请求都通过 Electron 的主进程进行，确保安全性</p>
          <p>• 支持自定义请求头、超时时间等配置</p>
        </div>
      </div>
    </div>
  )
}

export default RequestPage
