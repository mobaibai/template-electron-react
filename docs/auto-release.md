# 自动构建和发布指南

本项目已配置了 GitHub Actions 自动化工作流，可以在每次推送标签时自动构建跨平台安装包并发布到 GitHub Releases。

## 🚀 快速开始

### 1. 配置 GitHub 仓库

首先需要更新 `electron-builder.yml` 中的 GitHub 仓库信息：

```yaml
publish:
  provider: github
  owner: your-github-username  # 替换为你的 GitHub 用户名
  repo: your-repo-name         # 替换为你的仓库名
  private: false
```

### 2. 创建发布版本

有两种方式触发自动构建和发布：

#### 方式一：推送标签（推荐）

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 推送标签
git push origin --tags
```

#### 方式二：手动触发

1. 进入 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 选择 "Build and Release" 工作流
4. 点击 "Run workflow"
5. 输入版本号（如 v1.0.0）
6. 点击 "Run workflow"

## 📦 构建产物

工作流会自动构建以下平台的安装包：

- **Windows**: `.exe` 安装程序
- **macOS**: `.dmg` 磁盘映像
- **Linux**: `.AppImage` 和 `.deb` 包

所有构建产物会自动上传到 GitHub Releases。

## 🔄 自动更新

项目集成了 `electron-updater`，支持自动更新功能：

1. 应用启动时会检查 GitHub Releases 中的最新版本
2. 如果发现新版本，会提示用户更新
3. 用户确认后会自动下载并安装更新

## 🛠️ 本地构建和发布

如果需要本地构建和发布，可以使用以下命令：

```bash
# 构建所有平台并发布
pnpm release

# 构建特定平台并发布
pnpm release:win    # Windows
pnpm release:mac    # macOS
pnpm release:linux  # Linux
```

**注意**: 本地发布需要设置 `GH_TOKEN` 环境变量：

```bash
export GH_TOKEN=your_github_token
pnpm release
```

## 🔧 高级配置

### 自定义构建配置

可以在 `electron-builder.yml` 中自定义构建配置：

- 修改应用图标和名称
- 配置安装程序选项
- 设置代码签名（macOS/Windows）
- 配置自动更新服务器

### 工作流自定义

可以在 `.github/workflows/build-and-release.yml` 中自定义工作流：

- 修改触发条件
- 添加测试步骤
- 配置通知
- 添加部署后操作

## 📋 发布检查清单

在发布新版本前，请确保：

- [ ] 代码已通过所有测试
- [ ] 更新了版本号
- [ ] 更新了 CHANGELOG.md
- [ ] 确认 electron-builder.yml 配置正确
- [ ] GitHub 仓库有足够的权限

## 🐛 常见问题

### Q: 构建失败怎么办？

A: 检查 GitHub Actions 日志，常见问题：
- 依赖安装失败：检查 package.json
- 权限问题：确保 GITHUB_TOKEN 有足够权限
- 构建配置错误：检查 electron-builder.yml

### Q: 如何配置代码签名？

A: 在 electron-builder.yml 中添加签名配置：

```yaml
# macOS 签名
mac:
  identity: "Developer ID Application: Your Name"
  
# Windows 签名
win:
  certificateFile: "path/to/certificate.p12"
  certificatePassword: "password"
```

### Q: 如何自定义发布说明？

A: 可以创建 `.github/release-template.md` 文件自定义发布说明模板。

## 📚 相关文档

- [electron-builder 文档](https://www.electron.build/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [electron-updater 文档](https://www.electron.build/auto-update)