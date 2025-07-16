# GitHub Actions Best Practices Guide

## Overview

This guide provides best practices for using GitHub Actions in Electron React projects, including performance optimization, security considerations, and troubleshooting.

## 🚀 Performance Optimization

### 1. Dependency Caching Strategy

**Correct configuration order for pnpm:**

```yaml
# 1. Setup pnpm first
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10
    run_install: false

# 2. Then setup Node.js with pnpm caching
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'pnpm'

# 3. Optional: Manual cache for pnpm store
- name: Setup pnpm cache
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
```

**Common errors:**

- ❌ Using `cache: 'npm'` when the project uses pnpm
- ❌ Not setting up pnpm before Setup Node.js
- ❌ Missing pnpm-lock.yaml file

**Benefits:**

- Reduce dependency installation time by 50-80%
- Lower network bandwidth usage
- Improve build stability

### 2. Parallel Build Matrix

```yaml
strategy:
  fail-fast: false # Allow other platforms to continue building
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

**Benefits:**

- Build multiple platforms in parallel
- Single platform failure doesn't affect others
- Significantly reduce total build time

### 3. Build Artifact Cleanup

```yaml
- name: Clean dist directory
  run: pnpm clean:dist
  if: always() # Ensure cleanup always runs
```

**Effects:**

- Reduce storage usage by 80%+
- Speed up subsequent step execution
- Lower transfer costs

## 🔒 Security Best Practices

### 1. Principle of Least Privilege

```yaml
permissions:
  contents: read
  packages: write
  actions: read
```

### 2. Sensitive Information Management

```yaml
# Use GitHub Secrets
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  CSC_LINK: ${{ secrets.CSC_LINK }}
  CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
```

**Important Notes:**

- Never hardcode keys in code
- Use environment-specific Secrets
- Regularly rotate access tokens

### 3. Code Signing Security

```yaml
env:
  CSC_IDENTITY_AUTO_DISCOVERY: false # Disable auto discovery
```

## 📊 Monitoring and Logging

### 1. Build Status Monitoring

```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  if: failure() # Only upload on failure
  with:
    name: build-logs-${{ matrix.platform }}
    path: |
      dist/
      out/
      *.log
```

### 2. Notification Configuration

```yaml
# Optional: Add Slack/Discord notifications
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔧 Workflow Optimization Tips

### 1. Conditional Execution

```yaml
# Execute steps only under specific conditions
- name: Deploy to staging
  if: contains(github.ref, 'refs/tags/v') && contains(github.ref, '-beta')
  run: pnpm deploy:staging
```

### 2. Environment Variable Management

```yaml
env:
  NODE_ENV: production
  ELECTRON_CACHE: ${{ github.workspace }}/.cache/electron
  ELECTRON_BUILDER_CACHE: ${{ github.workspace }}/.cache/electron-builder
```

### 3. Timeout Settings

```yaml
jobs:
  release:
    timeout-minutes: 60 # Prevent infinite waiting
    steps:
      - name: Build
        timeout-minutes: 30 # Single step timeout
```

## 🐛 Troubleshooting Guide

### 1. Common Build Errors

#### Dependency Installation Failure

```bash
# Solution: Clear cache
- name: Clear cache
  run: |
    pnpm store prune
    rm -rf node_modules
    pnpm install
```

#### Out of Memory

```yaml
# Increase Node.js memory limit
env:
  NODE_OPTIONS: '--max-old-space-size=4096'
```

#### Permission Errors

```yaml
# Ensure correct permission settings
permissions:
  contents: write # Need write permission to publish Release
  packages: write
```

### 2. Debugging Techniques

#### Enable Debug Logging

```yaml
env:
  DEBUG: 'electron-builder'
  ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES: true
```

#### Preserve Build Artifacts

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: dist-${{ matrix.platform }}
    path: dist/
    retention-days: 7
```

## 📈 Performance Monitoring

### 1. Build Time Tracking

```yaml
- name: Build with timing
  run: |
    echo "::group::Build started at $(date)"
    time pnpm build
    echo "::endgroup::"
```

### 2. Resource Usage Monitoring

```yaml
- name: System info
  run: |
    echo "CPU cores: $(nproc)"
    echo "Memory: $(free -h)"
    echo "Disk space: $(df -h)"
```

## 🔄 Continuous Improvement

### 1. Regular Reviews

- **Monthly Check**: Dependency version updates
- **Quarterly Assessment**: Workflow performance and security
- **Pre-release**: Complete end-to-end testing

### 2. Metrics Collection

- Build time trends
- Success rate statistics
- Resource usage patterns
- User feedback

### 3. Automation Improvements

```yaml
# Automatic dependency updates
- name: Update dependencies
  uses: renovatebot/github-action@v32.0.0
  with:
    configurationFile: .github/renovate.json
```

## 📚 Related Resources

- [GitHub Actions Official Documentation](https://docs.github.com/en/actions)
- [electron-builder CI Configuration](https://www.electron.build/multi-platform-build.html#sample-configuration-for-github-actions)
- [pnpm GitHub Actions Integration](https://pnpm.io/continuous-integration#github-actions)
- [Code Signing Best Practices](https://www.electron.build/code-signing)

## 🎯 Checklist

Before release, please confirm:

- [ ] Workflow syntax is correct
- [ ] All required Secrets are configured
- [ ] Build matrix covers target platforms
- [ ] Cleanup steps work properly
- [ ] Error handling mechanisms are complete
- [ ] Security configuration meets requirements
- [ ] Performance optimizations are enabled
- [ ] Monitoring and logging are configured
