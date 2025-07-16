# Template Electron React

[English](./docs/README.en.md) | 简体中文

一个现代化的 Electron + React 桌面应用开发模板，集成了丰富的功能和最佳实践。

<p align="center">
  <img src="./build/icon.png" width="200" />
</p>

## 🚀 技术栈

### 核心框架

- **Electron**: v37+ 跨平台桌面应用框架
- **React**: v19+ 用户界面库
- **TypeScript**: v5+ 类型安全的JavaScript超集
- **Vite + electron-vite**: 现代化构建工具

### UI/UX

- **Ant Design**: 企业级UI组件库
- **UnoCSS**: 原子化CSS引擎
- **Three.js + React Three Fiber**: 3D图形渲染

### 状态管理与数据获取

- **Zustand**: 轻量级状态管理
- **SWR**: React Hooks数据获取库
- **React Router**: 客户端路由

### 开发工具

- **ESLint + Prettier**: 代码规范和格式化
- **electron-builder**: 应用打包和分发

## ✨ 功能特性

### 完整的IPC通信架构

- 主进程与渲染进程间安全通信
- HTTP客户端封装(类似Axios)
- 系统信息获取(CPU、内存、网络等)
- 文件操作和对话框

### 现代化UI设计

- 响应式布局
- 暗黑模式支持
- 动画效果
- 毛玻璃效果

### 3D图形支持

- Three.js集成
- GLB模型支持
- HDR环境贴图
- KTX2压缩纹理

### 自动更新机制

- 增量更新支持
- GitHub Releases自动发布
- CI/CD自动构建流水线

### 跨平台支持

- Windows (x64/arm64)
- macOS (x64/arm64)
- Linux (AppImage/Snap/Deb)

## 📁 项目结构

```
src/
├── main/                 # 主进程代码
│   ├── index.ts          # 主进程入口
│   ├── window-manager.ts # 窗口管理
│   ├── ipc-handles.ts    # IPC处理器
│   └── auto-updater.ts   # 自动更新
├── preload/              # 预加载脚本
│   └── index.ts          # 预加载入口
└── renderer/            # 渲染进程代码
    ├── src/
    │   ├── components/   # 可复用组件
    │   ├── pages/        # 页面组件
    │   ├── hooks/        # 自定义Hooks
    │   ├── stores/       # 状态管理
    │   ├── lib/          # 工具库
    │   ├── router/       # 路由配置
    │   ├── layout/       # 布局组件
    │   ├── examples/     # 示例代码
    │   ├── config/       # 配置文件
    │   └── utils/        # 工具函数
    └── index.html        # HTML模板
```

## 🔧 快速开始

### 推荐开发环境

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### 安装依赖

```bash
$ pnpm install
```

### 开发模式

```bash
$ pnpm dev
```

### 代码检查

```bash
# 代码格式化
$ pnpm format

# 代码规范检查
$ pnpm lint

# TypeScript类型检查
$ pnpm typecheck
```

### 构建应用

```bash
# Windows平台
$ pnpm build:win

# macOS平台
$ pnpm build:mac

# Linux平台
$ pnpm build:linux

# 所有平台
$ pnpm build:all
```

### 清理构建产物

构建完成后，`dist` 目录会包含大量中间文件。项目提供了自动清理功能：

```bash
# 手动清理dist目录
$ pnpm clean:dist
```

**自动清理**：所有构建命令（`build:win`、`build:mac`、`build:linux`、`build:all`）都会在构建完成后自动执行清理，只保留：

- 最终安装包文件（`.exe`、`.dmg`、`.deb`、`.snap`、`.AppImage`）
- Blockmap文件（用于增量更新）
- 自动更新配置文件（`.yml`）

清理后可减少80%以上的磁盘占用。详细说明请参考：[scripts/README.md](./docs/scripts-readme.md)

## 💡 核心功能使用

### IPC通信

#### 渲染进程调用主进程

```typescript
// 调用主进程方法
const systemInfo = await window.ipcRenderer.invoke('system-info')
```

#### HTTP客户端

```typescript
// 使用封装的HTTP客户端
import { useIpcAjax } from '@renderer/lib/ipc-ajax'

const { get, post } = useIpcAjax({ showLoading: true })

// GET请求
const data = await get('/api/users')

// POST请求
const result = await post('/api/users', { name: 'John' })
```

### 状态管理

```typescript
// 使用Zustand管理状态
import { useCountStore } from '@renderer/stores/useCountStore'

const { count, inc, cut } = useCountStore()
```

### 路由导航

```typescript
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/settings')
```

## 📦 构建与部署

### 应用配置

应用的构建配置位于 `electron-builder.yml` 文件中，可以根据需要修改：

- 应用名称和图标
- 打包格式和目标平台
- GitHub仓库信息
- 安装程序选项

### 自动发布

项目配置了 GitHub Actions 自动化工作流，支持自动构建和发布：

#### 配置步骤

1. **更新仓库信息**：修改 `electron-builder.yml` 中的 GitHub 仓库配置

```yaml
publish:
  provider: github
  owner: your-github-username
  repo: your-repo-name
```

2. **创建发布版本**：

```bash
# 更新版本号并推送标签
npm version patch
git push origin --tags
```

3. **自动构建**：GitHub Actions 会自动构建所有平台的安装包并发布到 Releases

#### GitHub Actions 清理功能

GitHub Actions 工作流已集成自动清理功能：

- **自动执行**：构建完成后自动清理 `dist` 目录
- **节省空间**：减少 80% 以上的存储使用
- **保留必要文件**：只保留安装包、更新配置和校验文件
- **总是执行**：无论构建成功或失败都会执行清理

详细配置请参考：[GitHub Actions 工作流说明](./docs/github-workflows-readme.md)

#### 支持的发布方式

- **标签触发**：推送 `v*.*.*` 格式的标签自动触发
- **本地发布**：使用 `pnpm release` 命令本地构建并发布

#### 故障排除

详细说明请参考：[自动发布指南](./docs/auto-release.md) | [Auto Release Guide](./docs/auto-release.en.md)

### 自动更新

项目集成了 `electron-updater` 用于自动更新：

1. 应用启动时自动检查 GitHub Releases 中的最新版本
2. 发现新版本时提示用户更新
3. 支持增量更新和后台下载

## 🧩 开发规范

### 主进程与渲染进程分离

- 主进程负责：窗口管理、系统API调用、文件操作、自动更新
- 渲染进程负责：UI渲染、用户交互、状态管理
- 通过IPC进行安全通信

### 组件化开发

- 将UI拆分为可复用的组件
- 使用自定义Hooks封装逻辑
- 保持组件的单一职责

### 类型安全

- 使用TypeScript定义接口和类型
- 为IPC通信定义类型
- 避免使用`any`类型

## 📚 文档

- [English Documentation](./docs/README.en.md) - Complete English documentation

### 自动发布

- [自动发布指南](./docs/auto-release.md) - 自动构建和发布流程说明
- [Auto Release Guide](./docs/auto-release.en.md) - Automated build and release process guide (English)

### GitHub Actions 工作流

- [GitHub Actions 工作流说明](./docs/github-workflows-readme.md) - 工作流配置和使用指南
- [GitHub Actions Workflow Documentation](./docs/github-workflows-readme.en.md) - Workflow configuration and usage guide (English)
- [GitHub Actions 权限配置](./docs/github-workflows-permissions.md) - 权限配置详细说明
- [GitHub Actions Permissions Configuration](./docs/github-workflows-permissions.en.md) - Permissions configuration guide (English)
- [GitHub Actions 最佳实践指南](./docs/github-workflows-best-practices.md) - 工作流最佳实践和优化建议
- [GitHub Actions Best Practices Guide](./docs/github-workflows-best-practices.en.md) - Workflow best practices and optimization guide (English)
- [GitHub Actions 故障排除指南](./docs/github-actions-troubleshooting.md) - 常见问题和解决方案
- [GitHub Actions Troubleshooting Guide](./docs/github-actions-troubleshooting.en.md) - Common issues and solutions (English)

### Scripts 工具

- [Scripts 工具说明](./docs/scripts-readme.md) - 项目辅助脚本使用指南
- [Scripts Tools Documentation](./docs/scripts-readme.en.md) - Project auxiliary scripts usage guide (English)
- [构建产物清理示例](./docs/clean-dist-example.md) - 清理脚本的详细使用示例
- [Dist Directory Cleanup Example](./docs/clean-dist-example.en.md) - Detailed usage examples of cleanup scripts (English)

## 📄 许可证

[MIT](./LICENSE)
