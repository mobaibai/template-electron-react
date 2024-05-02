import { LegacyRef, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import vhCheck from 'vh-check'
import { useReactToPrint } from 'react-to-print'
import RouterConainer from './router'
import { ThemePrimary } from '@renderer/config'
import './styles/global.scss'
import './styles/app.scss'

vhCheck()

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
    <div className={`App w-screen h-screen overflow-hidden`}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: ThemePrimary
          }
        }}
      >
        <div
          className={`bg-image w-screen h-screen overflow-hidden relative bg-#222533 ${isStart ? 'opacity-90' : 'opacity-100'}`}
        >
          <RouterConainer />
          <div
            className={`absolute w-25% h-25% rounded-50% top-35% left-30% transform-translate--50% filter-blur-10rem dark:rainbow-bgc`}
          />
        </div>
      </ConfigProvider>
    </div>
  )
}
export default App
