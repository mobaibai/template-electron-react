import { join } from 'path'
import { ipcMain, dialog, BrowserWindow, app, net } from 'electron'
import { is } from '@electron-toolkit/utils'
import getMAC from 'getmac'
import { arch, cpus, platform } from 'os'

/**
 * @description: Ipc 初始化
 * @return {type}
 */
export const ipcHandles = () => {
  ipcDefault()
  ipcOpen()

  const isDev = is.dev && process.env['ELECTRON_RENDERER_URL'] ? true : false

  /**
   * @description: 默认Ipc
   */
  function ipcDefault() {
    /* 系统信息 */
    ipcMain.handle('system-info', () => {
      return {
        arch: arch(),
        platform: platform(),
        cpus: cpus(),
        metrics: app.getAppMetrics()
      }
    })

    /* 版本信息 */
    ipcMain.handle('version-info', () => {
      return {
        nodeVersion: process.versions.node,
        electronVersion: process.versions.electron,
        chromeVersion: process.versions.chrome,
        appVersion: app.getVersion()
      }
    })

    /* 获取 MAC 码 */
    ipcMain.handle('get-mac', async () => {
      return getMAC()
    })

    /* 网络请求  */
    ipcMain.handle('request', async (event, options) => {
      const response = await net.fetch(options.url, { ...options })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const body = await response.json()
      return body
    })

    /* 关闭程序 */
    ipcMain.handle('app-close', () => {
      app.quit()
    })
  }

  /**
   * @description: Open类Ipc
   */
  function ipcOpen() {
    /** 获取路径 */
    ipcMain.handle('get-path', async () => {
      const { filePaths } = await dialog.showOpenDialog({
        title: '请选择',
        properties: ['openFile', 'openDirectory', 'createDirectory']
      })
      return filePaths[0]
    })

    /* 打开子窗口 */
    ipcMain.handle('open-window', async (event, path) => {
      const childWin = new BrowserWindow({
        title: '子窗口',
        width: 900,
        height: 720,
        useContentSize: true,
        resizable: false,
        transparent: false,
        show: true,
        autoHideMenuBar: true,
        webPreferences: {
          sandbox: false,
          // webSecurity: false,
          contextIsolation: true,
          // MacOS 橡皮动画
          scrollBounce: process.platform === 'darwin',
          devTools: isDev
        }
      })

      if (isDev) {
        childWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${path}`)
      } else {
        childWin.loadFile(join(__dirname, `../renderer/index.html`), {
          hash: path
        })
      }
    })

    const printOptions = {
      silent: false,
      printBackground: true,
      color: true,
      margin: {
        marginType: 'printableArea'
      },
      landscape: false,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      header: 'Page header',
      footer: 'Page footer'
    }
    /* 直接打印 */
    ipcMain.handle('print', async (event, url) => {
      const win = new BrowserWindow({ show: false })

      win.webContents.on('did-finish-load', () => {
        win.webContents.print(printOptions, (success, failureReason) => {
          console.log('Print Initiated in Main...')
          if (!success) console.log(failureReason)
        })
      })

      await win.loadURL(url)
      return 'shown print dialog'
    })

    /* 预览打印 */
    ipcMain.handle('print-preview', async (event, url) => {
      let childWin: any = new BrowserWindow({
        title: '打印预览',
        show: false,
        autoHideMenuBar: true
      })

      childWin.webContents.once('did-finish-load', () => {
        childWin.webContents
          .printToPDF(printOptions)
          .then((data: string) => {
            const buf = Buffer.from(data)
            data = buf.toString('base64')
            const url = `data:application/pdf;base64,${data}`

            childWin.webContents.on('ready-to-show', () => {
              childWin.once('page-title-updated', (e) => e.preventDefault())
              childWin.show()
            })

            childWin.webContents.on('closed', () => (childWin = null))
            childWin.loadURL(url)
          })
          .catch((error) => {
            console.log(error)
          })
      })

      await childWin.loadURL(url)
      return 'shown preview window'
    })
  }
}
