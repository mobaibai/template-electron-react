# Automated Build and Release Guide

English | [简体中文](./auto-release.md)

This project has configured GitHub Actions automated workflow that can automatically build cross-platform installation packages and publish them to GitHub Releases whenever tags are pushed.

## 🚀 Quick Start

### 1. Configure GitHub Repository

First, you need to update the GitHub repository information in `electron-builder.yml`:

```yaml
publish:
  provider: github
  owner: your-github-username # Replace with your GitHub username
  repo: your-repo-name # Replace with your repository name
  private: false
```

### 2. Create Release Version

#### Push Tags

```bash
# 1. Update version number
npm version patch  # or minor, major

# 2. Push tags
git push origin --tags
```

## 📦 Build Artifacts

The workflow will automatically build installation packages for the following platforms:

- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage`, `.deb`, and `.snap` packages

All build artifacts will be automatically uploaded to GitHub Releases.

## 🔄 Auto Update

The project integrates `electron-updater` to support auto-update functionality:

1. The application checks for the latest version in GitHub Releases on startup
2. If a new version is found, it prompts the user to update
3. After user confirmation, it automatically downloads and installs the update

## 🛠️ Local Build and Release

If you need to build and release locally, you can use the following commands:

```bash
# Build all platforms and release
pnpm release

# Build specific platform and release
pnpm release:win    # Windows
pnpm release:mac    # macOS
pnpm release:linux  # Linux
```

**Note**: Local release requires setting the `GH_TOKEN` environment variable:

```bash
export GH_TOKEN=your_github_token
pnpm release
```

## 🔧 Advanced Configuration

### Custom Build Configuration

You can customize build configuration in `electron-builder.yml`:

- Modify application icon and name
- Configure installer options
- Set up code signing (macOS/Windows)
- Configure auto-update server

### Workflow Customization

You can customize the workflow in `.github/workflows/build-and-release.yml`:

- Modify trigger conditions
- Add testing steps
- Configure notifications
- Add post-deployment actions

### Build Artifacts Cleanup

The workflow has integrated automatic cleanup functionality that automatically cleans the `dist` directory after build completion:

```yaml
- name: Clean dist directory
  run: pnpm clean:dist
  if: always()
```

**Cleanup Effects:**

- Before cleanup: dist directory ~4GB+
- After cleanup: only ~855MB of necessary files retained
- Space saved: reduces disk usage by 80%+

**Retained Files:**

- Platform installation packages (`.exe`, `.dmg`, `.AppImage`, `.deb`, `.snap`)
- Auto-update configuration files (`latest*.yml`)
- Verification files (`*.blockmap`)
- Build configuration files (`builder-*.yml`)

For detailed information, please refer to [GitHub Actions Workflow Documentation](./github-workflows-readme.en.md).

## 📋 Release Checklist

Before releasing a new version, please ensure:

- [ ] Code has passed all tests
- [ ] Version number has been updated
- [ ] CHANGELOG.md has been updated
- [ ] electron-builder.yml configuration is correct
- [ ] GitHub repository has sufficient permissions

## 🐛 Common Issues

### Q: GitHub Actions didn't trigger automatically after pushing tags?

**Possible reasons:**

- GitHub Actions permissions not enabled
- Actions disabled in repository settings
- Tag format doesn't match (must be v*.*.\* format)
- Network delay causing trigger delay

### Q: What to do when build fails?

A: Check GitHub Actions logs for common issues:

- Dependency installation failure: Check package.json
- Permission issues: Ensure GITHUB_TOKEN has sufficient permissions
- Build configuration errors: Check electron-builder.yml

### Q: How to configure code signing?

A: Add signing configuration in electron-builder.yml:

```yaml
# macOS signing
mac:
  identity: 'Developer ID Application: Your Name'

# Windows signing
win:
  certificateFile: 'path/to/certificate.p12'
  certificatePassword: 'password'
```

### Q: How to customize release notes?

A: You can create a `.github/release-template.md` file to customize the release notes template.

### Q: Linux build requirements?

A: For Linux builds, the following system dependencies are recommended:

- Ubuntu 18.04+ or equivalent
- Required packages: `libnotify4`, `libappindicator1`, `libxtst6`, `libnss3`
- For Snap packages: `snapcraft` tool

### Q: How to build for different architectures?

A: The current configuration supports:

- **Windows**: x64, arm64
- **macOS**: x64 (Intel), arm64 (Apple Silicon)
- **Linux**: x64 (additional architectures can be added in electron-builder.yml)

## 📚 Related Documentation

- [electron-builder Documentation](https://www.electron.build/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [electron-updater Documentation](https://www.electron.build/auto-update)
- [Linux Packaging Guide](https://www.electron.build/configuration/linux)
- [Code Signing Guide](https://www.electron.build/code-signing)
