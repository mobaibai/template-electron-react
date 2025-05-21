import { HashRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'virtual:uno.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Loader } from '@react-three/drei'

dayjs.locale('zh-cn')

const rootDiv = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootDiv)

root.render(
  <ConfigProvider locale={zhCN}>
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <App />
      <Loader />
    </HashRouter>
  </ConfigProvider>
)
