import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { ipcHandles } from './ipc-handles'
import { useMenu } from './hooks/menu'
import { createWindow, createMainWindow } from './window-manager'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  const { creactMenu } = useMenu()

  /* 创建菜单 */
  creactMenu()
  /* 创建 Ipc */
  ipcHandles()
  /* 创建窗口 */
  createWindow()
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
