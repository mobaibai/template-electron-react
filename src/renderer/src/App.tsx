// React19兼容包
import { useEffect, useState } from 'react'

import '@ant-design/v5-patch-for-react-19'
import AutoUpdater from '@renderer/components/AutoUpdater'
import { ThemePrimary } from '@renderer/config'
import RouterConainer from '@renderer/router'
import '@renderer/styles/app.scss'
import '@renderer/styles/global.scss'
import { ConfigProvider } from 'antd'
import { useLocation } from 'react-router-dom'
// @ts-ignore
import 'virtual:svgsprites'

interface Props {
  title?: string
}
const App: React.FC<Props> = () => {
  const _location = useLocation()
  const [isStart, setIsStart] = useState(false)

  useEffect(() => {
    if (['#/start-loading'].includes(window.location.hash)) setIsStart(true)
    else setIsStart(false)
  }, [_location])

  return (
    <div className="App w-screen h-screen overflow-hidden">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: ThemePrimary,
          },
        }}
      >
        <div
          className={`bg-image w-screen h-screen overflow-hidden relative ${isStart ? 'opacity-90' : 'opacity-100'}`}
        >
          <div
            className={`absolute w-15% h-15% rounded-50% top-30% left-30% transform-translate--50% filter-blur-6rem rainbow-bgc`}
          />
          <RouterConainer />
          <AutoUpdater />
        </div>
      </ConfigProvider>
    </div>
  )
}

export default App
