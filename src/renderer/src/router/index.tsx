import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { type RouteType, RouteItems } from './config'
import { Loading } from '@renderer/components/Loading'

const RouterViews = (routerItems: RouteType[]) => {
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
          <Route index element={<Navigate to={redirect || ''} replace />} />
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
