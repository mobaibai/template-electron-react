# GitHub Actions 权限配置

为了确保自动发布功能正常工作，需要配置适当的 GitHub Actions 权限。

## 🔐 必需权限

### 仓库权限

确保你的 GitHub 仓库具有以下设置：

1. **Actions 权限**：
   - 进入仓库 Settings → Actions → General
   - 选择 "Allow all actions and reusable workflows"

2. **Workflow 权限**：
   - 进入仓库 Settings → Actions → General → Workflow permissions
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"

### GITHUB_TOKEN 权限

默认的 `GITHUB_TOKEN` 已经具有发布 Release 所需的权限。如果遇到权限问题，可以在工作流文件中显式声明：

```yaml
permissions:
  contents: write
  packages: write
  actions: read
  security-events: write
```

## 🔧 自定义 Token（可选）

如果需要更高级的权限控制，可以创建个人访问令牌：

1. **创建 Personal Access Token**：
   - 进入 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 点击 "Generate new token (classic)"
   - 选择以下权限：
     - `repo` (完整仓库访问权限)
     - `write:packages` (发布包权限)

2. **添加到仓库 Secrets**：
   - 进入仓库 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - Name: `GH_TOKEN`
   - Value: 你的个人访问令牌

3. **更新工作流文件**：

```yaml
env:
  GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

## 🚨 安全注意事项

1. **最小权限原则**：只授予必需的权限
2. **定期轮换**：定期更新个人访问令牌
3. **监控使用**：定期检查 Actions 使用情况
4. **保护分支**：为主分支设置保护规则

## 🔍 故障排除

### 常见权限错误

1. **403 Forbidden**：
   - 检查 GITHUB_TOKEN 权限
   - 确认仓库 Actions 设置

2. **Resource not accessible by integration**：
   - 检查 Workflow permissions 设置
   - 确认是否需要自定义 Token

3. **Release creation failed**：
   - 检查是否有 `contents: write` 权限
   - 确认标签格式正确

### 调试步骤

1. 检查 Actions 日志中的详细错误信息
2. 验证仓库权限设置
3. 测试使用最小权限集
4. 如有必要，使用自定义 Token
