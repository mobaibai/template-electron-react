import React, { lazy } from 'react'

import { LayoutPage } from '@renderer/layout'
import { Home, HomeSkeleton } from '@renderer/pages/home'
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
    redirect: 'home',
    Element: LayoutPage,
    children: [
      {
        name: '首页',
        path: 'home',
        Element: Home,
        Skeleton: HomeSkeleton,
      },
      {
        name: '功能组件',
        path: 'components',
        Element: lazy(() => import('@renderer/pages/components')),
        Skeleton: lazy(() => import('@renderer/pages/components/skeleton')),
        children: [
          {
            name: '跟随导航',
            path: 'nav',
            Element: lazy(() => import('@renderer/pages/components/nav')),
            Skeleton: lazy(
              () => import('@renderer/pages/components/nav/skeleton')
            ),
          },
          {
            name: '全局弹窗',
            path: 'modal',
            Element: lazy(() => import('@renderer/pages/components/modal')),
            Skeleton: lazy(
              () => import('@renderer/pages/components/modal/skeleton')
            ),
          },
          {
            name: '图标展示',
            path: 'icons',
            Element: lazy(() => import('@renderer/pages/components/icons')),
            Skeleton: lazy(
              () => import('@renderer/pages/components/icons/skeleton')
            ),
          },
        ],
      },
      {
        name: '动画展示',
        path: 'animations',
        Element: lazy(() => import('@renderer/pages/animations')),
        Skeleton: lazy(() => import('@renderer/pages/animations/skeleton')),
      },
      {
        name: '模型展示',
        path: 'model',
        Element: lazy(() => import('@renderer/pages/model')),
      },
      {
        name: '网络请求',
        path: 'request',
        Element: lazy(() => import('@renderer/pages/request')),
      },
      {
        name: '版本信息',
        path: 'versions',
        Element: lazy(() => import('@renderer/pages/versions')),
      },
    ],
  },
  {
    name: '加载中...',
    path: '/start-loading',
    Element: StartLoading,
  },
  {
    path: '*',
    Element: lazy(() => import('@renderer/pages/404')),
  },
]
