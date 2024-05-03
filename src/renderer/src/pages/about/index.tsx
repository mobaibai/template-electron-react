import { LegacyRef, useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { useReactToPrint } from 'react-to-print'
import { useTitle } from '@renderer/hooks/useTitle'
import { Icon } from '@renderer/components/Icon'

interface Props {
  title?: string
}
export const About: React.FC<Props> = (props) => {
  if (props.title) useTitle(props.title)

  const [versionInfo, setVersionInfo] = useState<{ name: string; value: string }[]>([])
  const tablePrintRef = useRef<LegacyRef<HTMLDivElement> | any>()

  useEffect(() => {
    window.ipcRenderer.invoke('version-info').then((res) => {
      if (res) {
        setVersionInfo([
          { name: 'Node版本', value: res.nodeVersion },
          { name: 'Electron版本', value: res.electronVersion },
          { name: 'Chrome版本', value: res.chromeVersion },
          { name: '模板版本', value: res.appVersion }
        ])
      }
    })
  }, [])

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
    <div className="about-container h-full center relative" ref={tablePrintRef}>
      <div className="versions space-y-10">
        {versionInfo.length &&
          versionInfo.map((item) => (
            <div className="version" key={nanoid()}>
              <span className="text-gray-600 text-4">{item.name}：</span>
              <span className="dark:rainbow-text font-bold text-4">{item.value}</span>
            </div>
          ))}
      </div>
      <div
        className="print absolute bottom-10 right-10 dark:rainbow-text hover:cursor-pointer text-5 hover:text-6 transition-all center space-x-2"
        onClick={pdfPreviewHandler}
      >
        <Icon name="print" />
      </div>
    </div>
  )
}

export default About
