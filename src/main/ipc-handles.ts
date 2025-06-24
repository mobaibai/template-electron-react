import { is } from '@electron-toolkit/utils'
import { exec } from 'child_process'
import { BrowserWindow, app, dialog, ipcMain, net } from 'electron'
import getMAC from 'getmac'
import { arch, cpus, networkInterfaces, platform } from 'os'
import { join } from 'path'
import { promisify } from 'util'

import { autoUpdaterManager } from './auto-updater'

// 创建异步执行函数
const execAsync = promisify(exec)

/**
 * @description: IPC 初始化
 * @return {type}
 */
export const ipcHandles = () => {
  ipcDefault()
  ipcOperation()
  ipcAutoUpdater()
  ipcRequest()

  const isDev = is.dev && process.env['ELECTRON_RENDERER_URL'] ? true : false

  /**
   * @description: IPC-默认相关
   */
  function ipcDefault() {
    /* 系统信息 */
    ipcMain.handle('system-info', () => {
      return {
        arch: arch(),
        platform: platform(),
        cpus: cpus(),
        metrics: app.getAppMetrics(),
      }
    })

    /* 版本信息 */
    ipcMain.handle('version-info', () => {
      return {
        nodeVersion: process.versions.node,
        electronVersion: process.versions.electron,
        chromeVersion: process.versions.chrome,
        appVersion: app.getVersion(),
      }
    })

    /* 获取 MAC 码 */
    ipcMain.handle('get-mac', async () => {
      return getMAC()
    })

    /* 获取网络信息 */
    ipcMain.handle('get-network-info', async () => {
      try {
        // 获取局域网IP
        const interfaces = networkInterfaces()
        let localIP = '未知'
        for (const name of Object.keys(interfaces)) {
          const interfaceList = interfaces[name]
          if (interfaceList) {
            for (const net of interfaceList) {
              // 跳过内部地址和非IPv4地址
              if (!net.internal && net.family === 'IPv4') {
                localIP = net.address
                break
              }
            }
          }
        }

        // 获取外网IP
        let publicIP = '获取失败'
        try {
          // 使用AbortController实现超时
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)

          const response = await fetch('https://api.ipify.org?format=json', {
            signal: controller.signal,
          })
          clearTimeout(timeoutId)

          if (response.ok) {
            const data = await response.json()
            publicIP = data.ip
          }
        } catch (ipError) {
          console.log('获取外网IP失败，尝试备用服务')
          try {
            const controller2 = new AbortController()
            const timeoutId2 = setTimeout(() => controller2.abort(), 5000)

            const response2 = await fetch('https://httpbin.org/ip', {
              signal: controller2.signal,
            })
            clearTimeout(timeoutId2)

            if (response2.ok) {
              const data2 = await response2.json()
              publicIP = data2.origin
            }
          } catch (ipError2) {
            console.log('备用服务也失败，设置为离线状态')
            publicIP = '网络离线'
          }
        }

        return {
          localIP,
          publicIP,
        }
      } catch (error) {
        console.error('获取网络信息失败:', error)
        return {
          localIP: '获取失败',
          publicIP: '获取失败',
        }
      }
    })

    /* 获取硬盘信息 */
    ipcMain.handle('get-disk-info', async () => {
      try {
        let command = ''
        if (process.platform === 'darwin') {
          command = 'df -h /'
        } else if (process.platform === 'win32') {
          command = 'wmic logicaldisk get size,freespace,caption'
        } else {
          command = 'df -h /'
        }

        const { stdout } = await execAsync(command)
        let total = '未知'
        let free = '未知'
        let used = '未知'

        if (process.platform === 'darwin' || process.platform === 'linux') {
          const lines = stdout.split('\n')
          if (lines.length >= 2) {
            const parts = lines[1].split(/\s+/)
            total = parts[1]
            used = parts[2]
            free = parts[3]
          }
        } else if (process.platform === 'win32') {
          const lines = stdout.split('\n')
          if (lines.length >= 2) {
            const parts = lines[1].split(/\s+/)
            const totalBytes = parseInt(parts[1])
            const freeBytes = parseInt(parts[0])
            const usedBytes = totalBytes - freeBytes
            total = `${Math.round(totalBytes / 1024 / 1024 / 1024)}GB`
            free = `${Math.round(freeBytes / 1024 / 1024 / 1024)}GB`
            used = `${Math.round(usedBytes / 1024 / 1024 / 1024)}GB`
          }
        }

        return {
          total,
          used,
          free,
        }
      } catch (error) {
        console.error('获取硬盘信息失败:', error)
        return {
          total: '获取失败',
          used: '获取失败',
          free: '获取失败',
        }
      }
    })

    /* 获取路径 */
    ipcMain.handle('get-path', async () => {
      const { filePaths } = await dialog.showOpenDialog({
        title: '请选择',
        properties: ['openFile', 'openDirectory', 'createDirectory'],
      })
      return filePaths[0]
    })
  }

  /**
   * @description: IPC-操作相关
   */
  function ipcOperation() {
    /* 打开子窗口 */
    ipcMain.handle('open-window', async (_event, path) => {
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
          devTools: isDev,
        },
      })

      if (isDev) {
        childWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${path}`)
      } else {
        childWin.loadFile(join(__dirname, `../renderer/index.html`), {
          hash: path,
        })
      }
    })

    const printOptions = {
      silent: false,
      printBackground: true,
      color: true,
      margin: {
        marginType: 'printableArea',
      },
      landscape: false,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      header: 'Page header',
      footer: 'Page footer',
    }
    /* 直接打印 */
    ipcMain.handle('print', async (_event, url) => {
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
    ipcMain.handle('print-preview', async (_event, url) => {
      let childWin: any = new BrowserWindow({
        title: '打印预览',
        show: false,
        autoHideMenuBar: true,
      })

      childWin.webContents.once('did-finish-load', () => {
        childWin.webContents
          .printToPDF(printOptions)
          .then((data: string) => {
            const buf = Buffer.from(data)
            data = buf.toString('base64')
            const url = `data:application/pdf;base64,${data}`

            childWin.webContents.on('ready-to-show', () => {
              childWin.once('page-title-updated', e => e.preventDefault())
              childWin.show()
            })

            childWin.webContents.on('closed', () => (childWin = null))
            childWin.loadURL(url)
          })
          .catch(error => {
            console.log(error)
          })
      })

      await childWin.loadURL(url)
      return 'shown preview window'
    })

    /* 关闭程序 */
    ipcMain.handle('app-close', () => {
      app.quit()
    })
  }

  /**
   * @description: IPC-自动更新相关
   */
  function ipcAutoUpdater() {
    /* 手动检查更新 */
    ipcMain.handle('check-for-updates', async () => {
      try {
        autoUpdaterManager.checkForUpdates()
        return { success: true, message: '开始检查更新' }
      } catch (error: unknown | any) {
        return { success: false, message: error.message }
      }
    })

    /* 立即安装更新 */
    ipcMain.handle('quit-and-install', async () => {
      try {
        autoUpdaterManager.quitAndInstall()
        return { success: true, message: '开始安装更新' }
      } catch (error: unknown | any) {
        return { success: false, message: error.message }
      }
    })

    /* 获取应用版本 */
    ipcMain.handle('get-app-version', () => {
      return app.getVersion()
    })
  }
}

/**
 * @description: IPC-网络请求相关
 */
function ipcRequest() {
  // 通用请求处理函数
  const makeRequest = async (
    method: string,
    url: string,
    data?: any,
    config?: any
  ) => {
    return new Promise((resolve, reject) => {
      try {
        // 默认配置
        const defaultOptions = {
          method: method.toUpperCase(),
          timeout: 10000, // 10秒超时
          headers: {
            'User-Agent': 'Electron-App/1.0.0',
            'Content-Type': 'application/json',
          },
        }

        // 合并配置
        const requestConfig = { ...defaultOptions, ...config, url, data }

        // 验证必要参数
        if (!requestConfig.url) {
          return reject(new Error('URL is required'))
        }

        // 创建请求
        const request = net.request({
          method: requestConfig.method,
          url: requestConfig.url,
          headers: requestConfig.headers,
          redirect: requestConfig.redirect || 'follow',
        })

        let responseData = Buffer.alloc(0)
        let timeoutId: NodeJS.Timeout | null = null

        // 设置超时
        if (requestConfig.timeout) {
          timeoutId = setTimeout(() => {
            request.abort()
            reject(
              new Error(`Request timeout after ${requestConfig.timeout}ms`)
            )
          }, requestConfig.timeout)
        }

        // 监听响应
        request.on('response', response => {
          // 监听数据接收
          response.on('data', chunk => {
            responseData = Buffer.concat([responseData, chunk])
          })

          // 监听响应结束
          response.on('end', () => {
            if (timeoutId) {
              clearTimeout(timeoutId)
            }

            try {
              let parsedData: any = responseData

              // 根据Content-Type自动解析数据
              const contentType = response.headers['content-type'] || ''

              if (contentType.includes('application/json')) {
                try {
                  parsedData = JSON.parse(responseData.toString('utf8'))
                } catch (e) {
                  // JSON解析失败，保持原始数据
                  parsedData = responseData.toString('utf8')
                }
              } else if (contentType.includes('text/')) {
                parsedData = responseData.toString('utf8')
              } else if (requestConfig.responseType === 'buffer') {
                parsedData = responseData
              } else if (requestConfig.responseType === 'base64') {
                parsedData = responseData.toString('base64')
              } else {
                // 默认转为文本
                parsedData = responseData.toString('utf8')
              }

              const result = {
                data: parsedData,
                status: response.statusCode || 0,
                statusText: response.statusMessage || '',
                headers: response.headers,
                config: requestConfig,
                success:
                  (response.statusCode || 0) >= 200 &&
                  (response.statusCode || 0) < 300,
              }

              if (result.success) {
                resolve(result)
              } else {
                reject(new Error(`HTTP ${result.status}: ${result.statusText}`))
              }
            } catch (error) {
              reject(error)
            }
          })

          // 监听响应错误
          response.on('error', error => {
            if (timeoutId) {
              clearTimeout(timeoutId)
            }
            reject(error)
          })
        })

        // 监听请求错误
        request.on('error', error => {
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          reject(error)
        })

        // 监听请求中止
        request.on('abort', () => {
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          reject(new Error('Request was aborted'))
        })

        // 发送请求数据
        if (requestConfig.data) {
          if (typeof requestConfig.data === 'object') {
            // 如果是对象，转换为JSON
            request.write(JSON.stringify(requestConfig.data), 'utf8')
          } else {
            // 如果是字符串或Buffer，直接写入
            request.write(requestConfig.data)
          }
        }

        // 结束请求
        request.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  // GET 请求
  ipcMain.handle('http-get', async (_event, url: string, config?: any) => {
    return makeRequest('GET', url, undefined, config)
  })

  // POST 请求
  ipcMain.handle(
    'http-post',
    async (_event, url: string, data?: any, config?: any) => {
      return makeRequest('POST', url, data, config)
    }
  )

  ipcMain.handle('request', async (_event, options) => {
    const { method = 'GET', url, data, ...config } = options
    return makeRequest(method, url, data, config)
  })
}
