# Scripts 目录

这个目录包含了项目的辅助脚本。

## clean-dist.mjs

自动清理 `dist` 目录中的冗余文件和文件夹的脚本。

### 功能

- **保留文件**：
  - 最终安装包文件（`.exe`, `.dmg`, `.deb`, `.snap`, `.AppImage`）
  - Blockmap 文件（`.blockmap` - 用于增量更新）
  - 自动更新配置文件（`.yml`, `.yaml`）
  - 构建调试文件（`builder-debug.yml`, `builder-effective-config.yaml`）

- **删除文件**：
  - `linux-unpacked/` - Linux 构建中间产物
  - `win-unpacked/` - Windows x64 构建中间产物
  - `win-arm64-unpacked/` - Windows ARM64 构建中间产物
  - `mac/` - macOS x64 构建中间产物
  - `mac-arm64/` - macOS ARM64 构建中间产物
  - 其他不符合保留规则的文件

### 使用方法

#### 手动执行清理

```bash
# 使用 npm
npm run clean:dist

# 使用 yarn
yarn clean:dist

# 使用 pnpm
pnpm clean:dist

# 直接执行脚本
node scripts/clean-dist.mjs
```

#### 自动清理

清理脚本已经集成到构建流程中，以下命令会在构建完成后自动执行清理：

- `npm run build:win` - 构建 Windows 版本后自动清理
- `npm run build:mac` - 构建 macOS 版本后自动清理
- `npm run build:linux` - 构建 Linux 版本后自动清理
- `npm run build:all` - 构建所有平台后自动清理
- `npm run release` - 发布版本后自动清理
- `npm run release:all` - 发布所有平台后自动清理

### 清理效果

清理前的 `dist` 目录可能包含大量中间文件，占用几GB的空间。清理后只保留必要的安装包文件，通常可以减少 80% 以上的磁盘占用。

### 示例输出

```
开始清理 dist 目录...
✓ 已删除文件夹: linux-unpacked
✓ 已删除文件夹: win-unpacked
✓ 已删除文件夹: win-arm64-unpacked
✓ 已删除文件夹: mac
✓ 已删除文件夹: mac-arm64
✓ 保留文件: TemplateElectronReact-0.0.4-setup.exe
✓ 保留文件: TemplateElectronReact-0.0.4-x64.dmg
✓ 保留文件: TemplateElectronReact-0.0.4-amd64.deb
✓ 保留文件: latest.yml

清理完成！
保留项目: 18
删除项目: 5
剩余文件总大小: 855.21 MB
```

### 注意事项

- 清理操作是不可逆的，请确保在清理前已经备份了需要的文件
- 如果需要调试构建过程，可以在清理前检查 `unpacked` 文件夹中的内容
- 清理脚本只会删除预定义的文件夹和不符合保留规则的文件，不会影响其他重要文件
