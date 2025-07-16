import { is } from '@electron-toolkit/utils'
import { Menu, dialog, shell } from 'electron'
import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { arch, release, type } from 'os'

import { version } from '../../../package.json'

const menu: Array<MenuItemConstructorOptions | MenuItem> = [
  {
    label: '设置',
    submenu: [
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
      },
      {
        label: '快速重启',
        accelerator: 'CmdOrCtrl+R',
        role: 'reload',
      },
      {
        label: '关闭当前窗口',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      {
        label: '关闭所有窗口',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit',
      },
    ],
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '关于',
        click: async () => {
          const res = await dialog.showMessageBox({
            title: '关于',
            type: 'info',
            message: 'electron-react-vite脚手架',
            detail: `版本信息：${version}\n引擎版本：${
              process.versions.v8
            }\n当前系统：${type()} ${arch()} ${release()}`,
            noLink: true,
            // 点击查看github跳转到github
            buttons: ['确定', '查看github'],
          })

          if (res.response == 1) {
            shell.openExternal(
              'https://github.com/mobaibai/template-electron-react'
            )
          }
        },
      },
    ],
  },
]

/**
 * @description: 系统菜单
 * @return {type} creactMenu 创建菜单
 */
export const useMenu = () => {
  const creactMenu = () => {
    if (is.dev) {
      menu.push({
        label: '开发者设置',
        submenu: [
          {
            label: '切换到开发者模式',
            accelerator: 'Cmd+Alt+IOrCtrl+Alt+I',
            role: 'toggleDevTools',
          },
        ],
      })
    }
    const menuTemplate = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(menuTemplate)
  }
  return {
    creactMenu,
  }
}
