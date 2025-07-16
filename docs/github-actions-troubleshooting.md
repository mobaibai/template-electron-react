# GitHub Actions 故障排除指南

## 常见问题与解决方案

### 1. pnpm 相关错误

#### 问题描述

**错误信息：**

```
Error: Dependencies lock file is not found in /path/to/project.
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

**或者：**

```
pnpm: command not found
Error: Process completed with exit code 127.
```

#### 根本原因

1. **Setup Node.js 配置错误**：使用了 `cache: 'npm'` 但项目使用 pnpm
2. **步骤顺序错误**：在 Setup Node.js 之前没有设置 pnpm
3. **缺少 pnpm-lock.yaml**：项目根目录缺少锁定文件

#### 解决方案

**✅ 正确的工作流配置：**

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    with:
      fetch-depth: 0

  # 1. 先设置 pnpm（重要！）
  - name: Setup pnpm
    uses: pnpm/action-setup@v4
    with:
      version: 10
      run_install: false

  # 2. 再设置 Node.js 并启用 pnpm 缓存
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '22'
      cache: 'pnpm' # 使用 pnpm 而不是 npm

  # 3. 可选：手动缓存 pnpm store
  - name: Get pnpm store directory
    shell: bash
    run: |
      echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

  - name: Setup pnpm cache
    uses: actions/cache@v4
    with:
      path: ${{ env.STORE_PATH }}
      key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-pnpm-store-

  # 4. 安装依赖
  - name: Install dependencies
    run: pnpm install --frozen-lockfile
```

**❌ 错误的配置：**

```yaml
# 错误：先设置 Node.js，使用 npm 缓存
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm' # 错误！项目使用 pnpm

# 错误：pnpm 设置在后面
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10
```

### 2. 构建失败相关错误

#### 问题：权限不足

**错误信息：**

```
Error: Resource not accessible by integration
```

**解决方案：**

```yaml
jobs:
  release:
    runs-on: ${{ matrix.os }}
    permissions:
      contents: write
      packages: write
      actions: read
```

#### 问题：代码签名失败

**错误信息：**

```
Code signing failed
```

**解决方案：**

```yaml
- name: Build and Release
  run: pnpm release:${{ matrix.platform }}
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    CSC_IDENTITY_AUTO_DISCOVERY: false # 禁用自动代码签名
```

### 3. 缓存相关问题

#### 问题：缓存未命中

**症状：**

- 每次构建都重新下载依赖
- 构建时间过长

**解决方案：**

1. **检查缓存键**：

```yaml
key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
```

2. **确保 pnpm-lock.yaml 存在**：

```bash
# 本地生成锁定文件
pnpm install
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml"
```

### 4. 多平台构建问题

#### 问题：特定平台构建失败

**解决方案：**

1. **使用 fail-fast: false**：

```yaml
strategy:
  fail-fast: false # 允许其他平台继续构建
  matrix:
    include:
      - os: macos-latest
        platform: mac
      - os: windows-latest
        platform: win
      - os: ubuntu-latest
        platform: linux
```

2. **平台特定配置**：

```yaml
- name: Platform-specific setup
  if: matrix.os == 'windows-latest'
  run: |
    # Windows 特定配置
```

### 5. 调试技巧

#### 启用详细日志

```yaml
- name: Debug info
  run: |
    echo "Node version: $(node --version)"
    echo "pnpm version: $(pnpm --version)"
    echo "Current directory: $(pwd)"
    echo "Files in current directory:"
    ls -la
    echo "pnpm store path: $(pnpm store path)"
```

#### 保留构建产物用于调试

```yaml
- name: Upload artifacts on failure
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: debug-logs-${{ matrix.platform }}
    path: |
      dist/
      out/
      *.log
      .pnpm-debug.log
```

## 预防措施

### 1. 本地测试

在推送到 GitHub 之前，确保本地构建成功：

```bash
# 清理环境
rm -rf node_modules dist

# 重新安装依赖
pnpm install

# 运行完整构建流程
pnpm typecheck
pnpm lint
pnpm build
```

### 2. 定期更新依赖

```bash
# 更新 GitHub Actions
# 在 .github/workflows/*.yml 中使用最新版本

# 更新 pnpm
pnpm add -g pnpm@latest

# 更新项目依赖
pnpm update
```

### 3. 监控构建状态

- 设置 GitHub 通知
- 使用状态徽章监控构建状态
- 定期检查构建日志

## 相关资源

- [GitHub Actions 权限配置](./github-workflows-permissions.md)
- [GitHub Actions 最佳实践](./github-workflows-best-practices.md)
- [自动发布指南](./auto-release.md)
- [pnpm 官方文档](https://pnpm.io/)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
