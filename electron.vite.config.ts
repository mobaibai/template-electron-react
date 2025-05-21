import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { svgsprites } from './vite_plugins/svgsprites'

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
    plugins: [UnoCSS(), react(), svgsprites({ noOptimizeList: ['logo'] })],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    assetsInclude: [
      /* 二进制打包模型 */
      '**/*.glb',
      /* HDR环境贴图 */
      '**/*.hdr',
      /* 压缩纹理 */
      '**/*.ktx2'
    ]
  }
})
