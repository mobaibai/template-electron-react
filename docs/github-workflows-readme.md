# GitHub Actions 工作流说明

## 概述

本项目使用 GitHub Actions 自动化构建和发布流程，支持跨平台构建并自动清理构建产物。

## 工作流文件

### `build-and-release.yml`

主要的构建和发布工作流，包含以下功能：

#### 触发条件

- **自动触发**：推送符合 `v*.*.*` 格式的标签时
- **手动触发**：通过 GitHub Actions 界面手动运行

#### 构建矩阵

- **macOS**: x64 和 arm64 架构
- **Windows**: x64 和 arm64 架构
- **Linux**: x64 架构

#### 主要步骤

1. **代码检出**：获取完整的 Git 历史
2. **环境设置**：Node.js 22 + pnpm 10
3. **依赖缓存**：优化构建速度
4. **依赖安装**：使用 `pnpm install --frozen-lockfile`
5. **代码检查**：类型检查和 ESLint
6. **构建发布**：执行平台特定的构建命令
7. **清理构建产物**：自动清理 dist 目录中的冗余文件
8. **错误处理**：失败时上传构建日志

## 清理功能

### 自动清理

工作流在构建完成后会自动执行清理步骤：

```yaml
- name: Clean dist directory
  run: pnpm clean:dist
  if: always()
```

### 清理效果

- **清理前**：dist 目录可能包含 4GB+ 的文件
- **清理后**：只保留约 855MB 的必要文件
- **节省空间**：减少 80% 以上的磁盘使用

### 保留文件

清理后只保留以下必要文件：

- 各平台安装包（`.exe`, `.dmg`, `.AppImage`, `.deb`, `.snap`）
- 自动更新配置文件（`latest*.yml`）
- 校验文件（`*.blockmap`）
- 构建配置文件（`builder-*.yml`）

### 删除文件

清理过程会删除以下冗余文件：

- 未打包的应用目录（`*-unpacked/`）
- 临时构建文件夹（`mac*/`, `win*/`, `linux*/`）
- 应用包内容（`*.app/`, `Contents/`, `Resources/`）
- 本地化文件（`*.lproj/`）

## 环境变量

### 必需的 Secrets

- `GITHUB_TOKEN`：用于发布到 GitHub Releases（自动提供）

### 可选的 Secrets

- `CSC_LINK`：macOS 代码签名证书
- `CSC_KEY_PASSWORD`：证书密码
- `WIN_CSC_LINK`：Windows 代码签名证书
- `WIN_CSC_KEY_PASSWORD`：Windows 证书密码

## 最佳实践

### 1. 标签命名规范

使用语义化版本标签：

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. 构建优化

- 使用 pnpm 缓存加速依赖安装
- 并行构建多个平台
- 自动清理减少存储使用

### 3. 错误处理

- 构建失败时自动上传日志
- 使用 `fail-fast: false` 确保其他平台继续构建
- 清理步骤使用 `if: always()` 确保总是执行

### 4. 安全考虑

- 禁用自动代码签名发现（`CSC_IDENTITY_AUTO_DISCOVERY: false`）
- 使用最小权限的 GitHub Token
- 敏感信息通过 Secrets 管理

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 Actions 日志
   - 验证依赖版本兼容性
   - 确认代码签名配置

2. **发布失败**
   - 检查 GitHub Token 权限
   - 验证标签格式
   - 确认仓库设置

3. **清理失败**
   - 检查 `scripts/clean-dist.mjs` 文件
   - 验证 Node.js 版本兼容性
   - 查看清理脚本日志

### 调试技巧

1. **本地测试**：

   ```bash
   pnpm release:linux
   pnpm clean:dist
   ```

2. **查看构建产物**：

   ```bash
   ls -la dist/
   ```

3. **手动触发工作流**：
   - 在 GitHub Actions 页面使用 "Run workflow" 按钮

## 相关文档

- [构建脚本说明](../../scripts/README.md)
- [清理效果示例](../../scripts/clean-dist-example.md)
- [自动发布指南](../../docs/auto-release.md)
- [electron-builder 配置](../../electron-builder.yml)
