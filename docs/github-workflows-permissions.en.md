# GitHub Actions Permissions Configuration

To ensure the auto-release functionality works properly, you need to configure appropriate GitHub Actions permissions.

## 🔐 Required Permissions

### Repository Permissions

Ensure your GitHub repository has the following settings:

1. **Actions Permissions**:
   - Go to repository Settings → Actions → General
   - Select "Allow all actions and reusable workflows"

2. **Workflow Permissions**:
   - Go to repository Settings → Actions → General → Workflow permissions
   - Select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

### GITHUB_TOKEN Permissions

The default `GITHUB_TOKEN` already has the necessary permissions for publishing releases. If you encounter permission issues, you can explicitly declare them in the workflow file:

```yaml
permissions:
  contents: write
  packages: write
  actions: read
  security-events: write
```

## 🔧 Custom Token (Optional)

If you need more advanced permission control, you can create a personal access token:

1. **Create Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select the following permissions:
     - `repo` (Full repository access)
     - `write:packages` (Package publishing permissions)

2. **Add to Repository Secrets**:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GH_TOKEN`
   - Value: Your personal access token

3. **Update Workflow File**:

```yaml
env:
  GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

## 🚨 Security Considerations

1. **Principle of Least Privilege**: Only grant necessary permissions
2. **Regular Rotation**: Regularly update personal access tokens
3. **Monitor Usage**: Regularly check Actions usage
4. **Branch Protection**: Set protection rules for main branches

## 🔍 Troubleshooting

### Common Permission Errors

1. **403 Forbidden**:
   - Check GITHUB_TOKEN permissions
   - Verify repository Actions settings

2. **Resource not accessible by integration**:
   - Check Workflow permissions settings
   - Verify if custom Token is needed

3. **Release creation failed**:
   - Check for `contents: write` permission
   - Verify tag format is correct

### Debugging Steps

1. Check detailed error information in Actions logs
2. Verify repository permission settings
3. Test with minimal permission set
4. Use custom Token if necessary
