import { ElectronAPI } from '@electron-toolkit/preload'
import { ipcRenderer, shell } from 'electron'

interface MemoryInfo {
  jsHeapSizeLimit: number
  totalJSHeapSize: number
  usedJSHeapSize: number
}

declare global {
  interface Window {
    performance: {
      memory: MemoryInfo
    }
    electron: ElectronAPI
    api: unknown
    ipcRenderer: typeof ipcRenderer
    shell: typeof shell
    crash: {
      start: () => void
    }
  }

  interface SystemInfo {
    key: string
    name: string
    value: string | any[]
  }

  type isDev = boolean

  type JSONValue =
    | string
    | number
    | boolean
    | null
    | { [k: string]: JSONValue }
    | JSONValue[]

  type RequestQueryType = {
    query: Record<string, string>
  }

  type ItemType = {
    id?: string | number
  }

  type ResponseDataListType = {
    list: ItemType[]
    query: Record<string, string>
    pages: {
      page: number
      per: number
      total_page: number
    }
  }

  type DataType<R> = {
    code: number
    data: R
  }
}
