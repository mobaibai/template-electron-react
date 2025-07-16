# Dist 目录清理效果示例

## 清理前的 dist 目录结构

```
dist/
├── TemplateElectronReact-0.0.4-amd64.deb          # ✅ 保留 - Linux Deb 安装包
├── TemplateElectronReact-0.0.4-amd64.snap         # ✅ 保留 - Linux Snap 安装包
├── TemplateElectronReact-0.0.4-arm64-setup.exe    # ✅ 保留 - Windows ARM64 安装包
├── TemplateElectronReact-0.0.4-arm64.dmg          # ✅ 保留 - macOS ARM64 安装包
├── TemplateElectronReact-0.0.4-x86_64.AppImage    # ✅ 保留 - Linux AppImage 安装包
├── *.blockmap                                     # ✅ 保留 - 增量更新文件
├── latest*.yml                                    # ✅ 保留 - 自动更新配置
├── builder-*.yml                                  # ✅ 保留 - 构建配置文件
├── linux-unpacked/                                # ❌ 删除 - Linux 构建中间产物
│   ├── template-electron-react
│   ├── resources/
│   ├── locales/
│   └── ... (大量 Chromium 文件)
├── win-unpacked/                                   # ❌ 删除 - Windows 构建中间产物
│   ├── TemplateElectronReact.exe
│   ├── resources/
│   ├── locales/
│   └── ... (大量 Chromium 文件)
├── win-arm64-unpacked/                             # ❌ 删除 - Windows ARM64 构建中间产物
│   └── ... (类似结构)
├── mac/                                            # ❌ 删除 - macOS x64 构建中间产物
│   └── TemplateElectronReact.app/
└── mac-arm64/                                      # ❌ 删除 - macOS ARM64 构建中间产物
    └── TemplateElectronReact.app/
```

## 清理后的 dist 目录结构

```
dist/
├── TemplateElectronReact-0.0.4-amd64.deb
├── TemplateElectronReact-0.0.4-amd64.snap
├── TemplateElectronReact-0.0.4-arm64-setup.exe
├── TemplateElectronReact-0.0.4-arm64-setup.exe.blockmap
├── TemplateElectronReact-0.0.4-arm64.dmg
├── TemplateElectronReact-0.0.4-arm64.dmg.blockmap
├── TemplateElectronReact-0.0.4-setup.exe
├── TemplateElectronReact-0.0.4-setup.exe.blockmap
├── TemplateElectronReact-0.0.4-x64-setup.exe
├── TemplateElectronReact-0.0.4-x64-setup.exe.blockmap
├── TemplateElectronReact-0.0.4-x64.dmg
├── TemplateElectronReact-0.0.4-x64.dmg.blockmap
├── TemplateElectronReact-0.0.4-x86_64.AppImage
├── builder-debug.yml
├── builder-effective-config.yaml
├── latest-linux.yml
├── latest-mac.yml
└── latest.yml
```

## 清理效果对比

| 项目            | 清理前  | 清理后  | 节省空间 |
| --------------- | ------- | ------- | -------- |
| 文件/文件夹数量 | ~23 项  | 18 项   | ~22%     |
| 磁盘占用        | ~4.2 GB | ~855 MB | ~80%     |
| 保留的功能文件  | ✅ 完整 | ✅ 完整 | 无影响   |

## 清理规则说明

### 保留的文件类型

1. **安装包文件**
   - `.exe` - Windows 安装程序
   - `.dmg` - macOS 磁盘镜像
   - `.deb` - Debian/Ubuntu 包
   - `.snap` - Ubuntu Snap 包
   - `.AppImage` - Linux 便携应用

2. **更新相关文件**
   - `.blockmap` - 增量更新映射文件
   - `latest*.yml` - 自动更新配置文件

3. **调试配置文件**
   - `builder-debug.yml` - 构建调试信息
   - `builder-effective-config.yaml` - 有效构建配置

### 删除的文件类型

1. **构建中间产物**
   - `*-unpacked/` 文件夹 - 解包的应用程序文件
   - `mac/` 和 `mac-arm64/` 文件夹 - macOS 应用程序包

2. **冗余文件**
   - 不符合保留规则的其他文件

## 使用建议

1. **自动清理**：推荐使用集成的构建命令，会自动执行清理
2. **手动清理**：如果需要单独清理，使用 `pnpm clean:dist`
3. **调试需要**：如果需要调试构建产物，可以在清理前检查 unpacked 文件夹
4. **备份重要文件**：清理操作不可逆，请确保重要文件已备份
