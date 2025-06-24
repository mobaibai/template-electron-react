import { useEffect, useRef, useState } from 'react'

import { Icon } from '@renderer/components/Icon'
import { useTitle } from '@renderer/hooks/useTitle'
import { nanoid } from 'nanoid'
import { useReactToPrint } from 'react-to-print'

interface Props {
  title?: string
}

export const Versions: React.FC<Props> = props => {
  if (props.title) useTitle(props.title)

  const [versionInfo, setVersionInfo] = useState<
    { name: string; value: string }[]
  >([])
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.ipcRenderer.invoke('version-info').then(res => {
      if (res) {
        setVersionInfo([
          { name: 'Node版本', value: res.nodeVersion },
          { name: 'Electron版本', value: res.electronVersion },
          { name: 'Chrome版本', value: res.chromeVersion },
          { name: '模板版本', value: res.appVersion },
          // { name: '热更新测试', value: '热更新成功' }
        ])
      }
    })
  }, [])

  /**
   * @description: Electron环境下的自定义打印函数
   * @param iframe - 打印iframe元素
   * @return Promise<void>
   */
  const handleElectronPrint = async (
    iframe: HTMLIFrameElement
  ): Promise<void> => {
    try {
      console.log('forwarding print preview request...')

      // 获取iframe中的HTML内容
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        throw new Error('无法访问iframe文档')
      }

      const htmlContent = iframeDoc.documentElement.outerHTML
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      console.log('Generated print URL:', url)

      // 通过IPC调用主进程的打印预览功能
      await window.ipcRenderer.invoke('print-preview', url)

      // 清理blob URL
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('打印预览失败:', error)
    }
  }

  /**
   * @description: 打印处理函数
   */
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: '组件打印',
    print: handleElectronPrint,
    onPrintError: (errorLocation, error) => {
      console.error(`打印错误 (${errorLocation}):`, error)
    },
  })

  return (
    <div
      className="about-container h-full flex-center relative"
      ref={contentRef}
    >
      <div className="versions space-y-10">
        {versionInfo.length &&
          versionInfo.map(item => (
            <div className="version" key={nanoid()}>
              <span className="text-gray-600 text-4">{item.name}：</span>
              <span className="dark:rainbow-text font-bold text-4">
                {item.value}
              </span>
            </div>
          ))}
      </div>
      <div
        className="print absolute bottom-10 right-10 dark:rainbow-text hover:cursor-pointer text-5 hover:text-6 transition-all flex-center space-x-2"
        onClick={handlePrint}
      >
        <Icon name="print" />
      </div>
    </div>
  )
}

export default Versions
