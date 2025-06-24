import React from 'react'
import { useEffect, useRef, useState } from 'react'

import {
  AnimationOpacity,
  AnimationScale,
} from '@renderer/components/Animations'
import { useTitle } from '@renderer/hooks/useTitle'
import { useCountStore } from '@renderer/stores/useCountStore'
import { Button, Skeleton } from 'antd'
import { nanoid } from 'nanoid'

import SystemInfoCard from './SystemInfoCard'

interface Props {
  title?: string
}
export const Home: React.FC<Props> = props => {
  if (props.title) useTitle(props.title)

  const { inc, cut, count } = useCountStore()
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
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
    window.ipcRenderer.invoke('system-info').then(res => {
      if (res) {
        setSystemInfo([
          { key: 'arch', name: '芯片', value: res.arch },
          { key: 'platform', name: '平台', value: res.platform },
          { key: 'cpu', name: '处理器', value: res.cpus.length + '核' },
          { key: 'metrics', name: '使用率', value: res.metrics },
        ])
      }
    })
  }

  return (
    <div className="home-container min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-purple-800 dark:to-blue-800">
      <div className="p-10 max-w-6xl mx-auto">
        {/* 系统信息展示 */}
        <AnimationOpacity fromOpacity={0} toOpacity={1} duration={600}>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white backdrop-blur-sm">
            系统信息
          </h2>
          <div className="system-info-items flex items-center space-x-4">
            {systemInfo.length &&
              systemInfo.map((item: any) => (
                <div key={nanoid()} className="system-info-item flex-1 h-96">
                  <SystemInfoCard>
                    <div className="card-content relative h-full">
                      <div className="content px-6 py-4 h-full flex flex-col">
                        <div className="label text-xl font-bold text-gray-600 dark:text-gray-400 flex items-center backdrop-blur-sm">
                          {item.key}
                        </div>
                        <div className="info flex flex-col flex-1">
                          <div className="name text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {item.name}：
                          </div>
                          <div className="text flex-1 flex items-center justify-center text-base font-bold rainbow-text dark:rainbow-text">
                            {item.key !== 'metrics' ? (
                              <div>{item.value}</div>
                            ) : (
                              <div className="h-50 space-y-2 overflow-y-auto flex flex-col justify-center">
                                {item.value &&
                                  item.value.length &&
                                  item.value.map((item2: any) => (
                                    <div key={nanoid()}>
                                      {`${item2.type}：${item2.cpu.percentCPUUsage.toFixed(2)}%`}
                                    </div>
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
        </AnimationOpacity>

        {/* 计数器功能 */}
        <AnimationOpacity fromOpacity={0} toOpacity={1} duration={800}>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            计数器
          </h2>
          <div className="count-action flex items-center justify-center">
            <div className="backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-6">
                <AnimationScale
                  type="scaleIn"
                  fromScale={0.8}
                  toScale={1}
                  delay={300}
                >
                  <Button
                    onClick={cut}
                    size="large"
                    className="!bg-white/30 !border-white/50 hover:!bg-white/50 !text-gray-800 dark:!text-white !backdrop-blur-sm"
                  >
                    -
                  </Button>
                </AnimationScale>
                <div className="count-view w-20 text-4xl font-bold text-center rainbow-text dark:rainbow-text">
                  {count}
                </div>
                <AnimationScale
                  type="scaleIn"
                  fromScale={0.8}
                  toScale={1}
                  delay={500}
                >
                  <Button
                    onClick={inc}
                    size="large"
                    className="!bg-white/30 !border-white/50 hover:!bg-white/50 !text-gray-800 dark:!text-white !backdrop-blur-sm"
                  >
                    +
                  </Button>
                </AnimationScale>
              </div>
            </div>
          </div>
        </AnimationOpacity>
      </div>
    </div>
  )
}

export const HomeSkeleton = () => {
  return (
    <div className="home-skeleton p-[20px]">
      <Skeleton active />
    </div>
  )
}
