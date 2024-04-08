import { join } from 'path'
import os from 'os'
import { BrowserWindow, shell, app } from 'electron'
import { is } from '@electron-toolkit/utils'

let mainWindow: BrowserWindow
let loadingWindow: BrowserWindow

/**
 * @description: 创建主窗口
 */
export const createMainWindow = async () => {
  const devTools = is.dev && process.env['ELECTRON_RENDERER_URL'] ? true : false

  // console.log('系统位数：', os.arch(), '位')
  // console.log('系统平台：', os.platform())
  // console.log('处理器：', os.cpus().length, '核')
  // console.log('安装目录：', app.getPath('exe'))
  // console.log('使用情况：', app.getAppMetrics())

  mainWindow = new BrowserWindow({
    title: 'Main window',
    width: 1280,
    height: 800,
    useContentSize: true,
    resizable: true,
    show: false,
    transparent: false,
    ...(process.platform === 'linux' ? {} : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      scrollBounce: process.platform === 'darwin',
      devTools
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (loadingWindow) loadingWindow.destroy()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

/**
 * @description: 创建 Loading 窗口
 */
const createLoadingWindow = () => {
  loadingWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    skipTaskbar: true,
    transparent: true,
    resizable: false,
    webPreferences: {
      // webSecurity: false,
      experimentalFeatures: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loadingWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/start-loading`)
  } else {
    loadingWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '#/start-loading'
    })
  }
  loadingWindow.show()
  loadingWindow.setAlwaysOnTop(true)

  setTimeout(() => {
    createMainWindow()
  }, 1800)
}

/**
 * @description: 创建窗口
 */
export const createWindow = () => {
  createLoadingWindow()
}
