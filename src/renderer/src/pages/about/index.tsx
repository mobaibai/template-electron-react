import { useTitle } from '@renderer/hooks/useTitle'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

interface Props {
  title?: string
}
export const About: React.FC<Props> = (props) => {
  if (props.title) useTitle(props.title)

  const [versionInfo, setVersionInfo] = useState<{ name: string; value: string }[]>([])

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

  return (
    <div className="about-container h-full flex-col center">
      <div className="versions space-y-10">
        {versionInfo.length &&
          versionInfo.map((item) => (
            <div className="version" key={nanoid()}>
              <span className="text-gray-600 text-4">{item.name}：</span>
              <span className="dark:rainbow-text font-bold text-4">{item.value}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

export default About
