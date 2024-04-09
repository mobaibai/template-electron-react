import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import SystemInfoCard from './components/SystemInfoCard'

interface Props {
  title?: string
}
export const Index: React.FC<Props> = (props) => {
  if (props.title) document.title = props.title

  const timer = useRef<any>(null)
  const [systemInfo, setSystemInfo] = useState<SystemInfo[]>([])

  useEffect(() => {
    systemInfoHandler()
    timer.current = setInterval(() => {
      systemInfoHandler()
    }, 5000)

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [])

  /**
   * @description: 系统信息操作
   * @return {type}
   */
  const systemInfoHandler = () => {
    window.ipcRenderer.invoke('systemInfo').then((res) => {
      if (res) {
        setSystemInfo([
          { key: 'arch', name: '芯片架构', value: res.arch },
          { key: 'platform', name: '系统平台', value: res.platform },
          { key: 'cpus', name: '处理器', value: res.cpus.length + '核' },
          { key: 'metrics', name: '使用率', value: res.metrics }
        ])
      }
    })
  }

  return (
    <div className="index-container px-10 py-30 relative bg-#222533 h-full">
      <div className="absolute w-25% h-25% rounded-50% top-40% left-30% transform-translate--50% filter-blur-10rem dark:rainbow-bgc" />
      <div className="system-info-items flex items-center space-x-10">
        {systemInfo.length &&
          systemInfo.map((item: any) => (
            <div key={nanoid()} className="system-info-item flex-1 h-24rem">
              <SystemInfoCard>
                <div className="card-content relative h-full">
                  <div className="content px-4 py-2 h-full flex flex-col">
                    <div className="label text-8 font-bold c-gray-700">{item.key}</div>
                    <div className="info flex flex-col flex-1">
                      <div className="name text-4 c-gray-500">{item.name}：</div>
                      <div className="text flex-1 center text-5 font-bold dark:rainbow-text">
                        {item.key !== 'metrics' ? (
                          <div>{item.value}</div>
                        ) : (
                          <div className="h-60 space-y-2 overflow-y-auto flex flex-col justify-center">
                            {item.value &&
                              item.value.length &&
                              item.value.map((item2) => (
                                <div
                                  key={nanoid()}
                                >{`${item2.type}：${item2.cpu.percentCPUUsage.toFixed(2)}%`}</div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SystemInfoCard>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Index
