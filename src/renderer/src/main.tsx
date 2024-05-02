import { HashRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'virtual:uno.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const rootDiv = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootDiv)

root.render(
  <ConfigProvider locale={zhCN}>
    <HashRouter>
      <App />
    </HashRouter>
  </ConfigProvider>
)
