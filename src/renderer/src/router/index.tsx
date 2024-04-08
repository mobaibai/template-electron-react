import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { RouteType } from './config'
import { RouteItems } from './config'
import { Loading } from '@renderer/components/Loading'
import { useIsShowStore } from '@renderer/stores'

const RouterViews = (routerItems: RouteType[]) => {
  const _location = useLocation()
  const { setIsShow } = useIsShowStore((state) => state)

  useEffect(() => {
    setIsShow({
      header: ['#/start-loading'].includes(window.location.hash) ? false : true,
    })
  }, [_location])

  if (routerItems && routerItems.length) {
    return routerItems.map(({ name = '', path, Skeleton, Element, children, redirect }) => {
      return children && children.length ? (
        <Route
          path={path}
          key={path}
          element={
            <Suspense fallback={!Skeleton ? <Loading /> : <Skeleton />}>
              <Element title={name} />
            </Suspense>
          }
        >
          {RouterViews(children)}
          <Route path={path} element={<Navigate to={!redirect ? children[0].path : redirect} />} />
        </Route>
      ) : (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={!Skeleton ? <Loading /> : <Skeleton />}>
              <Element title={name} />
            </Suspense>
          }
        ></Route>
      )
    })
  }
}

const RouterContainer = () => {
  return (
    <>
      <Routes>{RouterViews(RouteItems)}</Routes>
    </>
  )
}

export default React.memo(RouterContainer)
