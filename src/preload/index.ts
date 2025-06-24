import { electronAPI } from '@electron-toolkit/preload'
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {}

// IPC
const ipcRendererApi = {
  addListener: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.addListener(channel, listener),
  invoke: (channel: string, args: any) => ipcRenderer.invoke(channel, args),
  off: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.removeListener(channel, listener),
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on(channel, listener),
  once: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.once(channel, listener),
  postMessage: (channel: string, message: any) =>
    ipcRenderer.postMessage(channel, message),
  removeAllListeners: (channel: string) =>
    ipcRenderer.removeAllListeners(channel),
  removeListener: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.removeListener(channel, listener),
  send: (channel: string, args?: any) => ipcRenderer.send(channel, args),
  sendSync: (channel: string, args?: any) =>
    ipcRenderer.sendSync(channel, args),
  sendToHost: (channel: string, args?: any) =>
    ipcRenderer.sendToHost(channel, args),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipcRenderer', ipcRendererApi)
  } catch (error) {
    console.error(error)
  }
} else {
  ;(window as any).electron = electronAPI
  ;(window as any).api = api
  ;(window as any).ipcRenderer = ipcRendererApi
}
