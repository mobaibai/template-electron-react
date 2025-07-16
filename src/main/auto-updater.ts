import { BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

// 导入类型定义
export interface UpdateInfo {
  version: string
  releaseNotes?: string | null
  releaseDate?: string
}

/**
 * 自动更新管理器
 */
export class AutoUpdaterManager {
  private mainWindow: BrowserWindow | null = null

  constructor(mainWindow?: BrowserWindow) {
    this.mainWindow = mainWindow || null
    this.setupAutoUpdater()
  }

  /**
   * 设置自动更新
   */
  private setupAutoUpdater() {
    if (process.env.NODE_ENV === 'development') {
      console.log('开发环境，跳过自动更新检查')
      return
    }

    // 配置更新服务器（如果需要的话）
    // autoUpdater.setFeedURL({
    //   provider: 'generic',
    //   url: 'https://your-update-server.com/updates'
    // })

    // 监听更新事件
    this.bindUpdateEvents()

    // 应用启动后检查更新
    setTimeout(() => {
      this.checkForUpdates()
    }, 3000) // 延迟3秒检查，避免影响应用启动
  }

  /**
   * 绑定更新事件
   */
  private bindUpdateEvents() {
    autoUpdater.on('checking-for-update', () => {
      console.log('正在检查更新...')
      this.sendToRenderer('update-checking')
    })

    autoUpdater.on('update-available', info => {
      console.log('发现新版本:', info.version)
      this.sendToRenderer('update-available', info)
      // 将 electron-updater 的 UpdateInfo 类型转换为本地 UpdateInfo 类型
      this.showUpdateDialog({
        version: info.version,
        releaseNotes:
          typeof info.releaseNotes === 'string' ? info.releaseNotes : null,
        releaseDate: info.releaseDate,
      })
    })

    autoUpdater.on('update-not-available', info => {
      console.log('当前已是最新版本:', info.version)
      this.sendToRenderer('update-not-available', info)
    })

    autoUpdater.on('error', err => {
      console.error('自动更新出错:', err)
      this.sendToRenderer('update-error', err.message)
    })

    autoUpdater.on('download-progress', progressObj => {
      const log_message = `下载进度: ${progressObj.percent.toFixed(2)}% (${progressObj.transferred}/${progressObj.total})`
      console.log(log_message)
      this.sendToRenderer('update-download-progress', progressObj)
    })

    autoUpdater.on('update-downloaded', info => {
      console.log('更新下载完成:', info.version)
      this.sendToRenderer('update-downloaded', info)
      this.showInstallDialog(info)
    })
  }

  /**
   * 检查更新
   */
  public checkForUpdates() {
    if (process.env.NODE_ENV === 'development') {
      console.log('开发环境，跳过自动更新检查')
      return
    }
    autoUpdater.checkForUpdatesAndNotify()
  }

  /**
   * 显示更新可用对话框
   */
  private async showUpdateDialog(info: UpdateInfo) {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: '发现新版本',
      message: `发现新版本 ${info.version}，是否立即下载？`,
      detail: info.releaseNotes || '新版本包含功能改进和错误修复',
      buttons: ['稍后提醒', '立即下载'],
      defaultId: 1,
      cancelId: 0,
    })

    if (response === 1) {
      console.log('开始下载更新...')
      // 立即发送下载开始事件
      this.sendToRenderer('update-download-started', info)
      // 开始下载
      autoUpdater.downloadUpdate()
    }
  }

  /**
   * 显示安装更新对话框
   */
  private async showInstallDialog(info: any) {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: '更新下载完成',
      message: `新版本 ${info.version} 已下载完成，是否立即重启安装？`,
      detail: '重启后将自动安装新版本',
      buttons: ['立即重启', '稍后安装'],
      defaultId: 0,
      cancelId: 1,
    })

    if (response === 0) {
      autoUpdater.quitAndInstall()
    }
  }

  /**
   * 向渲染进程发送消息
   */
  private sendToRenderer(channel: string, data?: any) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(`auto-updater-${channel}`, data)
    }
  }

  /**
   * 手动安装更新
   */
  public quitAndInstall() {
    autoUpdater.quitAndInstall()
  }

  /**
   * 设置主窗口引用
   */
  public setMainWindow(window: BrowserWindow) {
    this.mainWindow = window
  }
}

// 导出单例实例
export const autoUpdaterManager = new AutoUpdaterManager()
