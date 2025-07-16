# GitHub Actions 最佳实践指南

## 概述

本指南提供了在 Electron React 项目中使用 GitHub Actions 的最佳实践，包括性能优化、安全考虑和故障排除。

## 🚀 性能优化

### 1. 依赖缓存策略

```yaml
# 使用 pnpm 缓存
- name: Setup pnpm cache
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
```

**优势：**

- 减少依赖安装时间 50-80%
- 降低网络带宽使用
- 提高构建稳定性

### 2. 并行构建矩阵

```yaml
strategy:
  fail-fast: false # 允许其他平台继续构建
  matrix:
    include:
      - os: macos-latest
        platform: mac
        arch: x64,arm64
      - os: windows-latest
        platform: win
        arch: x64,arm64
      - os: ubuntu-latest
        platform: linux
        arch: x64
```

**优势：**

- 并行构建多个平台
- 单个平台失败不影响其他平台
- 总构建时间显著减少

### 3. 构建产物清理

```yaml
- name: Clean dist directory
  run: pnpm clean:dist
  if: always() # 确保总是执行清理
```

**效果：**

- 减少存储使用 80%+
- 加快后续步骤执行
- 降低传输成本

## 🔒 安全最佳实践

### 1. 最小权限原则

```yaml
permissions:
  contents: read
  packages: write
  actions: read
```

### 2. 敏感信息管理

```yaml
# 使用 GitHub Secrets
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  CSC_LINK: ${{ secrets.CSC_LINK }}
  CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
```

**注意事项：**

- 永远不要在代码中硬编码密钥
- 使用环境特定的 Secrets
- 定期轮换访问令牌

### 3. 代码签名安全

```yaml
env:
  CSC_IDENTITY_AUTO_DISCOVERY: false # 禁用自动发现
```

## 📊 监控和日志

### 1. 构建状态监控

```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  if: failure() # 仅在失败时上传
  with:
    name: build-logs-${{ matrix.platform }}
    path: |
      dist/
      out/
      *.log
```

### 2. 通知配置

```yaml
# 可选：添加 Slack/Discord 通知
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔧 工作流优化技巧

### 1. 条件执行

```yaml
# 仅在特定条件下执行步骤
- name: Deploy to staging
  if: contains(github.ref, 'refs/tags/v') && contains(github.ref, '-beta')
  run: pnpm deploy:staging
```

### 2. 环境变量管理

```yaml
env:
  NODE_ENV: production
  ELECTRON_CACHE: ${{ github.workspace }}/.cache/electron
  ELECTRON_BUILDER_CACHE: ${{ github.workspace }}/.cache/electron-builder
```

### 3. 超时设置

```yaml
jobs:
  release:
    timeout-minutes: 60 # 防止无限等待
    steps:
      - name: Build
        timeout-minutes: 30 # 单步超时
```

## 🐛 故障排除指南

### 1. 常见构建错误

#### 依赖安装失败

```bash
# 解决方案：清理缓存
- name: Clear cache
  run: |
    pnpm store prune
    rm -rf node_modules
    pnpm install
```

#### 内存不足

```yaml
# 增加 Node.js 内存限制
env:
  NODE_OPTIONS: '--max-old-space-size=4096'
```

#### 权限错误

```yaml
# 确保正确的权限设置
permissions:
  contents: write # 需要写权限发布 Release
  packages: write
```

### 2. 调试技巧

#### 启用调试日志

```yaml
env:
  DEBUG: 'electron-builder'
  ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES: true
```

#### 保留构建产物

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: dist-${{ matrix.platform }}
    path: dist/
    retention-days: 7
```

## 📈 性能监控

### 1. 构建时间追踪

```yaml
- name: Build with timing
  run: |
    echo "::group::Build started at $(date)"
    time pnpm build
    echo "::endgroup::"
```

### 2. 资源使用监控

```yaml
- name: System info
  run: |
    echo "CPU cores: $(nproc)"
    echo "Memory: $(free -h)"
    echo "Disk space: $(df -h)"
```

## 🔄 持续改进

### 1. 定期审查

- **每月检查**：依赖版本更新
- **每季度评估**：工作流性能和安全性
- **版本发布前**：完整的端到端测试

### 2. 指标收集

- 构建时间趋势
- 成功率统计
- 资源使用情况
- 用户反馈

### 3. 自动化改进

```yaml
# 自动依赖更新
- name: Update dependencies
  uses: renovatebot/github-action@v32.0.0
  with:
    configurationFile: .github/renovate.json
```

## 📚 相关资源

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [electron-builder CI 配置](https://www.electron.build/multi-platform-build.html#sample-configuration-for-github-actions)
- [pnpm GitHub Actions 集成](https://pnpm.io/continuous-integration#github-actions)
- [代码签名最佳实践](https://www.electron.build/code-signing)

## 🎯 检查清单

发布前请确认：

- [ ] 工作流语法正确
- [ ] 所有必需的 Secrets 已配置
- [ ] 构建矩阵覆盖目标平台
- [ ] 清理步骤正常工作
- [ ] 错误处理机制完善
- [ ] 安全配置符合要求
- [ ] 性能优化已启用
- [ ] 监控和日志配置完整
