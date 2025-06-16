import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { ipcHandles } from './ipc-handles'
import { useMenu } from './hooks/menu'
import { createWindow, createMainWindow } from './window-manager'
// import { autoUpdaterManager } from './auto-updater'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electrontmp.app')

  const { creactMenu } = useMenu()

  /* 创建菜单 */
  creactMenu()
  /* 创建 Ipc */
  ipcHandles()
  /* 创建窗口 */
  createWindow()

  /* 初始化自动更新 */
  // autoUpdaterManager 会自动初始化
})

app.on('browser-window-created', (_, window) => {
  console.log('窗口创建')
  optimizer.watchWindowShortcuts(window)
})

app.on('activate', () => {
  console.log('MacOS窗口激活')
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
