import { LegacyRef, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import vhCheck from 'vh-check'
import { useReactToPrint } from 'react-to-print'
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
  const _location = useLocation()
  const tablePrintRef = useRef<LegacyRef<HTMLDivElement> | any>()
  const [showConf] = useIsShowStore((state) => [state.showConf])
  const { setIsShow } = useIsShowStore((state) => state)

  useEffect(() => {
    setIsShow({
      header: ['#/start-loading'].includes(window.location.hash) ? false : true
    })
  }, [_location])

  /**
   * @description: 打印预览
   * @param {type} target
   * @return {type}
   */
  const printPdfPreview = function (target) {
    return new Promise(() => {
      console.log('forwarding print preview request...')

      const data = target.contentWindow.document.documentElement.outerHTML
      const blob = new Blob([data], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      console.log('url', url)

      window.ipcRenderer.invoke('print-preview', url)
    })
  }

  /**
   * @description: 打印
   * @return {type}
   */
  const pdfPreviewHandler = useReactToPrint({
    content: () => tablePrintRef.current,
    documentTitle: '组件打印',
    print: printPdfPreview
  })

  return (
    <div className={`App w-screen h-screen overflow-hidden`} ref={tablePrintRef}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: ThemePrimary
          }
        }}
      >
        <div
          className={`bg-image w-screen h-screen overflow-hidden flex flex-col${showConf.header ? ' bg-#222533' : ''}`}
        >
          {!showConf.header ? null : <Header />}
          <div className={`limit relative w-1280px mx-auto relative flex-1`}>
            <RouterConainer />
            <div
              className={`absolute w-25% h-25% rounded-50% top-35% left-30% transform-translate--50% filter-blur-10rem dark:rainbow-bgc`}
            />
            <div
              className="print absolute bottom-10 right-10 dark:rainbow-text hover:cursor-pointer text-4 hover:text-5 transition-all"
              hidden={!showConf.header}
              onClick={pdfPreviewHandler}
            >
              打印
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  )
}
export default App
