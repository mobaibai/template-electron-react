import * as React from 'react'
import { usePageTitle } from '@renderer/stores'

/**
 * @description: 设置页面 Title
 * @param {string} title
 * @return {type} null
 * @example:
 * useTitle('首页')
 */
export function useTitle(title?: string) {
  const { setPageTitle } = usePageTitle((state) => state)
  React.useEffect(() => {
    if (title === undefined || title === null) return
    setPageTitle(title)
    document.title = title
  }, [])
}
