import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    base: './',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [UnoCSS(), react()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  }
})
