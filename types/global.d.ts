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
    ipcRenderer: typeof ipcRenderer
    shell: typeof shell
    crash: {
      start: () => void
    }
  }
}
