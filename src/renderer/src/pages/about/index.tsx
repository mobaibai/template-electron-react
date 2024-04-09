import { useEffect, useState } from 'react'

interface Props {
  title?: string
}
export const About: React.FC<Props> = (props) => {
  if (props.title) document.title = props.title

  const [versionInfo, setVersionInfo] = useState({})

  useEffect(() => {
    window.ipcRenderer.invoke('versionInfo').then((res) => {
      if(res){
        setVersionInfo(res)
      }
      console.log('Node版本：', res.nodeVersion)
      console.log('Electron版本：', res.electronVersion)
      console.log('Chrome版本：', res.chromeVersion)
      console.log('模板版本：', res.appVersion)
    })
  }, [])

  return <div className="about-container">About</div>
}

export default About
