import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import UnoCSS from 'unocss/vite'
import { svgsprites } from './vite_plugins/svgsprites'

export default defineConfig(
  {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      define: {
        __isDev__: process.env.NODE_ENV === 'development',
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
      },

      plugins: [UnoCSS(), react(), svgsprites({ noOptimizeList: ['logo'] })],

      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },

      base: './',

      assetsInclude: [
        /* 二进制打包模型 */
        '**/*.glb',
        /* HDR环境贴图 */
        '**/*.hdr',
        /* 压缩纹理 */
        '**/*.ktx2'
      ],

      build: {
        chunkSizeWarningLimit: 1024,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      }
    }
  }
)
