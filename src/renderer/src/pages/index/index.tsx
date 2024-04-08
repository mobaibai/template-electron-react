import { useEffect } from 'react'

interface Props {
  title?: string
}
export const Index: React.FC<Props> = (props) => {
  if (props.title) document.title = props.title

  useEffect(() => {
    window.ipcRenderer.invoke('systemInfo').then((res) => {
      console.log('系统位数：', res.arch, '位')
      console.log('系统平台：', res.platform)
      console.log('处理器：', res.cpus.length, '核')
      console.log('占用情况：', res.metrics)
      console.log('安装目录：', res.appPath)
      console.log('Node版本：', res.nodeVersion)
      console.log('Electron版本：', res.electronVersion)
      console.log('Chrome版本：', res.chromeVersion)
    })
  }, [])

  return <div className="index-container">Index</div>
}

export default Index
