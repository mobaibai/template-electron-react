import { useCallback, useEffect, useState } from 'react'

// 更新状态类型
export interface UpdateInfo {
  version: string
  releaseNotes?: string
  releaseDate?: string
}

export interface UpdateProgress {
  bytesPerSecond: number
  percent: number
  transferred: number
  total: number
}

export interface UpdateState {
  checking: boolean
  available: boolean
  downloading: boolean
  downloaded: boolean
  error: string | null
  progress: UpdateProgress | null
  updateInfo: UpdateInfo | null
}

/**
 * 自动更新Hook
 */
export function useAutoUpdater() {
  const [updateState, setUpdateState] = useState<UpdateState>({
    checking: false,
    available: false,
    downloading: false,
    downloaded: false,
    error: null,
    progress: null,
    updateInfo: null,
  })

  const [appVersion, setAppVersion] = useState<string>('')

  // 检查更新
  const checkForUpdates = useCallback(async () => {
    try {
      const result = await window.ipcRenderer?.invoke('check-for-updates')
      if (!result?.success) {
        setUpdateState(prev => ({
          ...prev,
          error: result?.message || '检查更新失败',
        }))
      }
    } catch (error) {
      setUpdateState(prev => ({ ...prev, error: '检查更新失败' }))
    }
  }, [])

  // 立即安装更新
  const quitAndInstall = useCallback(async () => {
    try {
      await window.ipcRenderer?.invoke('quit-and-install')
    } catch (error) {
      setUpdateState(prev => ({ ...prev, error: '安装更新失败' }))
    }
  }, [])

  // 获取应用版本
  const getAppVersion = useCallback(async () => {
    try {
      const version = await window.ipcRenderer?.invoke('get-app-version')
      setAppVersion(version || '')
    } catch (error) {
      console.error('获取应用版本失败:', error)
    }
  }, [])

  // 监听自动更新事件
  useEffect(() => {
    if (!window.ipcRenderer) return

    // 检查更新中
    const handleChecking = () => {
      setUpdateState(prev => ({
        ...prev,
        checking: true,
        error: null,
      }))
    }

    // 发现新版本
    const handleAvailable = (_event, info: UpdateInfo) => {
      setUpdateState(prev => ({
        ...prev,
        checking: false,
        available: true,
        updateInfo: info,
      }))
    }

    // 没有新版本
    const handleNotAvailable = (_event, info: UpdateInfo) => {
      setUpdateState(prev => ({
        ...prev,
        checking: false,
        available: false,
        updateInfo: info,
      }))
    }

    // 更新错误
    const handleError = (_event, message: string) => {
      setUpdateState(prev => ({
        ...prev,
        checking: false,
        downloading: false,
        error: message,
      }))
    }

    // 下载进度
    const handleDownloadStarted = (_event, info: UpdateInfo) => {
      setUpdateState(prev => ({
        ...prev,
        downloading: true,
        progress: null,
        updateInfo: info,
      }))
    }

    const handleProgress = (_event, progress: UpdateProgress) => {
      setUpdateState(prev => ({
        ...prev,
        downloading: true,
        progress,
      }))
    }

    // 下载完成
    const handleDownloaded = (_event, info: UpdateInfo) => {
      setUpdateState(prev => ({
        ...prev,
        downloading: false,
        downloaded: true,
        updateInfo: info,
      }))
    }

    // 绑定事件监听器
    window.ipcRenderer.on?.('auto-updater-update-checking', handleChecking)
    window.ipcRenderer.on?.('auto-updater-update-available', handleAvailable)
    window.ipcRenderer.on?.(
      'auto-updater-update-not-available',
      handleNotAvailable
    )
    window.ipcRenderer.on?.('auto-updater-update-error', handleError)
    window.ipcRenderer.on?.(
      'auto-updater-update-download-started',
      handleDownloadStarted
    )
    window.ipcRenderer.on?.(
      'auto-updater-update-download-progress',
      handleProgress
    )
    window.ipcRenderer.on?.('auto-updater-update-downloaded', handleDownloaded)

    // 获取应用版本
    getAppVersion()

    // 清理事件监听器
    return () => {
      window.ipcRenderer.off?.('auto-updater-update-checking', handleChecking)
      window.ipcRenderer.off?.('auto-updater-update-available', handleAvailable)
      window.ipcRenderer.off?.(
        'auto-updater-update-not-available',
        handleNotAvailable
      )
      window.ipcRenderer.off?.('auto-updater-update-error', handleError)
      window.ipcRenderer.off?.(
        'auto-updater-update-download-started',
        handleDownloadStarted
      )
      window.ipcRenderer.off?.(
        'auto-updater-update-download-progress',
        handleProgress
      )
      window.ipcRenderer.off?.(
        'auto-updater-update-downloaded',
        handleDownloaded
      )
    }
  }, [])

  return {
    updateState,
    appVersion,
    checkForUpdates,
    quitAndInstall,
    getAppVersion,
  }
}
