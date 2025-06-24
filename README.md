# Template Electron React

一个现代化的 Electron + React 桌面应用开发模板，集成了丰富的功能和最佳实践。

<p align="center">
  <img src="./build/icon.png" width="200" />
</p>

## 🚀 技术栈

### 核心框架
- **Electron**: v29+ 跨平台桌面应用框架
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
- 自定义更新服务器

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
```

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
- 自动更新服务器
- 安装程序选项

### 自动更新

项目集成了 `electron-updater` 用于自动更新：

1. 修改 `electron-builder.yml` 中的 `publish` 配置指向你的更新服务器
2. 使用 `autoUpdaterManager` 管理更新流程

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

## 📄 许可证

[MIT](./LICENSE)
