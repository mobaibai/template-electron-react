import React, { Suspense } from 'react'

import { Loading } from '@renderer/components/Loading'
import RouteTransition from '@renderer/components/RouteTransition'
import { Navigate, Route, Routes } from 'react-router-dom'

import { RouteItems, type RouteType } from './config'

const RouterViews = (routerItems: RouteType[]) => {
  if (routerItems && routerItems.length) {
    return routerItems.map(
      ({ name = '', path, Skeleton, Element, children, redirect }) => {
        return children && children.length ? (
          <Route
            path={path}
            key={path}
            element={
              <RouteTransition>
                <Suspense fallback={!Skeleton ? <Loading /> : <Skeleton />}>
                  <Element title={name} />
                </Suspense>
              </RouteTransition>
            }
          >
            {RouterViews(children)}
            {redirect && (
              <Route index element={<Navigate to={redirect} replace />} />
            )}
          </Route>
        ) : (
          <Route
            key={path}
            path={path}
            element={
              <RouteTransition>
                <Suspense fallback={!Skeleton ? <Loading /> : <Skeleton />}>
                  <Element title={name} />
                </Suspense>
              </RouteTransition>
            }
          />
        )
      }
    )
  }

  return null
}

const RouterContainer = () => {
  return <Routes>{RouterViews(RouteItems)}</Routes>
}

export default React.memo(RouterContainer)
