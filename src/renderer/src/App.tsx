import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import vhCheck from 'vh-check'
import RouterConainer from './router'
import { Header } from '@renderer/components/Header'
import { ThemePrimary } from '@renderer/config'
import { useIsShowStore } from './stores'
import './styles/global.scss'
import './styles/app.scss'
import { useEffect } from 'react'

vhCheck()

interface Props {
  title?: string
}
const App: React.FC<Props> = () => {
  const [showConf] = useIsShowStore((state) => [state.showConf])

  return (
    <div className={`App w-screen h-screen overflow-hidden${window.location.pathname}`}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: ThemePrimary
          }
        }}
      >
        <HashRouter>
          <div className={`bg-image w-screen h-screen flex flex-col`}>
            {!showConf.header ? null : <Header />}
            <div
              className={`limit relative w-1280px mx-auto flex-1${window.location.hash !== '#/start-loading' ? ' bg-#222533' : ''}`}
            >
              <div
                className={`absolute w-25% h-25% rounded-50% top-35% left-30% transform-translate--50% filter-blur-10rem dark:rainbow-bgc`}
              />
              <RouterConainer />
            </div>
          </div>
        </HashRouter>
      </ConfigProvider>
    </div>
  )
}
export default App
