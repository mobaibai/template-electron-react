# Template Electron React

English | [简体中文](../README.md)

A modern Electron + React desktop application development template with rich features and best practices.

<p align="center">
  <img src="./build/icon.png" width="200" />
</p>

## 🚀 Tech Stack

### Core Frameworks

- **Electron**: v37+ Cross-platform desktop application framework
- **React**: v19+ User interface library
- **TypeScript**: v5+ Type-safe JavaScript superset
- **Vite + electron-vite**: Modern build tools

### UI/UX

- **Ant Design**: Enterprise-class UI component library
- **UnoCSS**: Atomic CSS engine
- **Three.js + React Three Fiber**: 3D graphics rendering

### State Management & Data Fetching

- **Zustand**: Lightweight state management
- **SWR**: React Hooks data fetching library
- **React Router**: Client-side routing

### Development Tools

- **ESLint + Prettier**: Code standards and formatting
- **electron-builder**: Application packaging and distribution

## ✨ Features

### Complete IPC Communication Architecture

- Secure communication between main and renderer processes
- HTTP client wrapper (Axios-like)
- System information retrieval (CPU, memory, network, etc.)
- File operations and dialogs

### Modern UI Design

- Responsive layout
- Dark mode support
- Animation effects
- Glass morphism effects

### 3D Graphics Support

- Three.js integration
- GLB model support
- HDR environment mapping
- KTX2 compressed textures

### Auto-Update Mechanism

- Incremental update support
- GitHub Releases automatic publishing
- CI/CD automated build pipeline

### Cross-Platform Support

- Windows (x64/arm64)
- macOS (x64/arm64)
- Linux (AppImage/Snap/Deb/RPM)

## 📁 Project Structure

```
src/
├── main/                 # Main process code
│   ├── index.ts          # Main process entry
│   ├── window-manager.ts # Window management
│   ├── ipc-handles.ts    # IPC handlers
│   └── auto-updater.ts   # Auto updater
├── preload/              # Preload scripts
│   └── index.ts          # Preload entry
└── renderer/            # Renderer process code
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── hooks/        # Custom hooks
    │   ├── stores/       # State management
    │   ├── lib/          # Utility libraries
    │   ├── router/       # Router configuration
    │   ├── layout/       # Layout components
    │   ├── examples/     # Example code
    │   ├── config/       # Configuration files
    │   └── utils/        # Utility functions
    └── index.html        # HTML template
```

## 🔧 Quick Start

### Recommended Development Environment

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Install Dependencies

```bash
$ pnpm install
```

### Development Mode

```bash
$ pnpm dev
```

### Code Quality

```bash
# Code formatting
$ pnpm format

# Code linting
$ pnpm lint

# TypeScript type checking
$ pnpm typecheck
```

### Build Application

```bash
# Windows platform
$ pnpm build:win

# macOS platform
$ pnpm build:mac

# Linux platform
$ pnpm build:linux

# All platforms
$ pnpm build:all
```

### Clean Build Artifacts

After building, the `dist` directory will contain many intermediate files. The project provides automatic cleanup functionality:

```bash
# Manually clean dist directory
$ pnpm clean:dist
```

**Automatic Cleanup**: All build commands (`build:win`, `build:mac`, `build:linux`, `build:all`) will automatically execute cleanup after building, keeping only:

- Final installation package files (`.exe`, `.dmg`, `.deb`, `.snap`, `.AppImage`)
- Blockmap files (for incremental updates)
- Auto-update configuration files (`.yml`)

Cleanup can reduce disk usage by over 80%. For detailed information, refer to: [scripts/README.md](./docs/scripts-readme.md)

## 💡 Core Feature Usage

### IPC Communication

#### Renderer Process Calling Main Process

```typescript
// Call main process method
const systemInfo = await window.ipcRenderer.invoke('system-info')
```

#### HTTP Client

```typescript
// Use wrapped HTTP client
import { useIpcAjax } from '@renderer/lib/ipc-ajax'

const { get, post } = useIpcAjax({ showLoading: true })

// GET request
const data = await get('/api/users')

// POST request
const result = await post('/api/users', { name: 'John' })
```

### State Management

```typescript
// Use Zustand for state management
import { useCountStore } from '@renderer/stores/useCountStore'

const { count, inc, cut } = useCountStore()
```

### Router Navigation

```typescript
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/settings')
```

## 📦 Build & Deployment

### Application Configuration

The build configuration is located in the `electron-builder.yml` file and can be modified as needed:

- Application name and icon
- Package format and target platforms
- GitHub repository information
- Installer options

### Automated Release

The project is configured with GitHub Actions automated workflow for automatic building and releasing:

#### Configuration Steps

1. **Update Repository Information**: Modify the GitHub repository configuration in `electron-builder.yml`

```yaml
publish:
  provider: github
  owner: your-github-username
  repo: your-repo-name
```

2. **Create Release Version**:

```bash
# Update version number and push tags
npm version patch
git push origin --tags
```

3. **Automatic Build**: GitHub Actions will automatically build installation packages for all platforms and publish to Releases

#### GitHub Actions Cleanup Feature

GitHub Actions workflow has integrated automatic cleanup functionality:

- **Automatic Execution**: Automatically cleans `dist` directory after build completion
- **Space Saving**: Reduces storage usage by over 80%
- **Retain Necessary Files**: Only keeps installation packages, update configurations, and verification files
- **Always Execute**: Cleanup runs regardless of build success or failure

For detailed configuration, refer to: [GitHub Actions Workflow Documentation](./docs/github-workflows-readme.en.md)

#### Supported Release Methods

- **Tag Trigger**: Automatically triggered by pushing tags in `v*.*.*` format
- **Local Release**: Use `pnpm release` command for local build and release

#### Troubleshooting

For detailed instructions, refer to: [Auto Release Guide](./docs/auto-release.en.md) | [自动发布指南](./docs/auto-release.md)

### Auto Update

The project integrates `electron-updater` for automatic updates:

1. Automatically checks for the latest version in GitHub Releases on application startup
2. Prompts user to update when a new version is found
3. Supports incremental updates and background downloads

## 🧩 Development Guidelines

### Main Process and Renderer Process Separation

- Main process responsibilities: Window management, system API calls, file operations, auto updates
- Renderer process responsibilities: UI rendering, user interaction, state management
- Secure communication through IPC

### Component-Based Development

- Break UI into reusable components
- Use custom Hooks to encapsulate logic
- Maintain single responsibility for components

### Type Safety

- Use TypeScript to define interfaces and types
- Define types for IPC communication
- Avoid using `any` type

## 📚 Documentation

### Auto Release

- [自动发布指南](./docs/auto-release.md) - 自动构建和发布流程说明 (中文)
- [Auto Release Guide](./docs/auto-release.en.md) - Automated build and release process guide

### GitHub Actions Workflows

- [GitHub Actions 工作流说明](./github-workflows-readme.md) - Workflow configuration and usage guide (Chinese)
- [GitHub Actions Workflow Documentation](./github-workflows-readme.en.md) - Workflow configuration and usage guide (English)
- [GitHub Actions 权限配置](./github-workflows-permissions.md) - Permissions configuration guide (Chinese)
- [GitHub Actions Permissions Configuration](./github-workflows-permissions.en.md) - Permissions configuration guide (English)
- [GitHub Actions 最佳实践指南](./github-workflows-best-practices.md) - Workflow best practices and optimization guide (Chinese)
- [GitHub Actions Best Practices Guide](./github-workflows-best-practices.en.md) - Workflow best practices and optimization guide (English)
- [GitHub Actions 故障排除](./github-actions-troubleshooting.md) - Troubleshooting guide (Chinese)
- [GitHub Actions Troubleshooting](./github-actions-troubleshooting.en.md) - Troubleshooting guide (English)

### Scripts Tools

- [Scripts 工具说明](./docs/scripts-readme.md) - 项目辅助脚本使用指南 (中文)
- [Scripts Tools Documentation](./docs/scripts-readme.en.md) - Project auxiliary scripts usage guide
- [Build Artifacts Cleanup Example](./docs/clean-dist-example.md) - Detailed usage examples of cleanup scripts (中文)
- [Dist Directory Cleanup Example](./docs/clean-dist-example.en.md) - Detailed usage examples of cleanup scripts (English)

## 📄 License

[MIT](./LICENSE)
