import { lazy } from 'react'
import { LayoutPage } from '@renderer/layout'
import StartLoading from '@renderer/pages/start-loading'

export interface RouteType {
  key?: string
  to?: string
  path: string
  redirect?: string
  roles?: string[]
  name?: string
  Element: React.LazyExoticComponent<React.FC<any>> | React.FC<any>
  Skeleton?: React.FC<any>
  children?: RouteType[]
}

export const RouteItems: RouteType[] = [
  {
    path: '/',
    Element: LayoutPage,
    redirect: 'index',
    children: [
      {
        name: '首页',
        path: 'index',
        Element: lazy(() => import('@renderer/pages/index'))
      },
      {
        name: '模型',
        path: 'model',
        Element: lazy(() => import('@renderer/pages/model'))
      },
      {
        name: '关于',
        path: 'about',
        Element: lazy(() => import('@renderer/pages/about'))
      }
    ]
  },
  {
    name: '加载中...',
    path: '/start-loading',
    Element: StartLoading
  }
]
