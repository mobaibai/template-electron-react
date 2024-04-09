import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import vhCheck from 'vh-check'
import RouterConainer from './router'
import { Header } from '@renderer/components/Header'
import { ThemePrimary } from '@renderer/config'
import { useIsShowStore } from './stores'
import './styles/global.scss'
import './styles/app.scss'

vhCheck()

interface Props {
  title?: string
}
const App: React.FC<Props> = () => {
  const [showConf] = useIsShowStore((state) => [state.showConf])

  return (
    <div className="App w-screen h-screen overflow-hidden bg-#222533">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: ThemePrimary
          }
        }}
      >
        <HashRouter>
          <div className={`bg-image w-screen h-screen`}>
            {!showConf.header ? null : <Header />}
            <div className="limit w-1280px mx-auto">
              <RouterConainer />
            </div>
          </div>
        </HashRouter>
      </ConfigProvider>
    </div>
  )
}
export default App
