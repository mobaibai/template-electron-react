#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 清理 dist 目录中的冗余文件和文件夹
 * 保留：
 * - 最终安装包文件 (.exe, .dmg, .deb, .snap, .AppImage)
 * - blockmap 文件 (用于增量更新)
 * - 自动更新配置文件 (.yml)
 * - 调试配置文件 (builder-debug.yml, builder-effective-config.yaml)
 *
 * 删除：
 * - unpacked 文件夹 (构建中间产物)
 * - mac 和 mac-arm64 文件夹 (构建中间产物)
 */

const distPath = path.join(__dirname, '..', 'dist')

// 需要删除的文件夹模式
const foldersToDelete = [
  'linux-unpacked',
  'win-unpacked',
  'win-arm64-unpacked',
  'mac',
  'mac-arm64',
]

// 需要保留的文件扩展名
const keepExtensions = [
  '.exe',
  '.dmg',
  '.deb',
  '.snap',
  '.AppImage',
  '.blockmap',
  '.yml',
  '.yaml',
]

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(file => {
      const curPath = path.join(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(folderPath)
    console.log(`✓ 已删除文件夹: ${path.basename(folderPath)}`)
  }
}

function shouldKeepFile(fileName) {
  return keepExtensions.some(ext => fileName.endsWith(ext))
}

function cleanDist() {
  if (!fs.existsSync(distPath)) {
    console.log('dist 目录不存在，无需清理')
    return
  }

  console.log('开始清理 dist 目录...')

  const items = fs.readdirSync(distPath)
  let deletedCount = 0
  let keptCount = 0

  items.forEach(item => {
    const itemPath = path.join(distPath, item)
    const stat = fs.lstatSync(itemPath)

    if (stat.isDirectory()) {
      // 删除指定的文件夹
      if (foldersToDelete.includes(item)) {
        deleteFolderRecursive(itemPath)
        deletedCount++
      } else {
        console.log(`✓ 保留文件夹: ${item}`)
        keptCount++
      }
    } else {
      // 检查文件是否需要保留
      if (shouldKeepFile(item)) {
        console.log(`✓ 保留文件: ${item}`)
        keptCount++
      } else {
        fs.unlinkSync(itemPath)
        console.log(`✓ 已删除文件: ${item}`)
        deletedCount++
      }
    }
  })

  console.log(`\n清理完成！`)
  console.log(`保留项目: ${keptCount}`)
  console.log(`删除项目: ${deletedCount}`)

  // 显示剩余文件大小
  const remainingItems = fs.readdirSync(distPath)
  const totalSize = remainingItems.reduce((size, item) => {
    const itemPath = path.join(distPath, item)
    const stat = fs.lstatSync(itemPath)
    return size + (stat.isFile() ? stat.size : 0)
  }, 0)

  console.log(`剩余文件总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
}

// 检查是否为直接运行的模块
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanDist()
}

export { cleanDist }
