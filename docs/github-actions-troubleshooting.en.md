# GitHub Actions Troubleshooting Guide

## Common Issues and Solutions

### 1. pnpm Related Errors

#### Problem Description

**Error message:**

```
Error: Dependencies lock file is not found in /path/to/project.
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

**Or:**

```
pnpm: command not found
Error: Process completed with exit code 127.
```

#### Root Causes

1. **Incorrect Setup Node.js configuration**: Using `cache: 'npm'` when project uses pnpm
2. **Wrong step order**: Not setting up pnpm before Setup Node.js
3. **Missing pnpm-lock.yaml**: Project root directory lacks lock file

#### Solutions

**✅ Correct workflow configuration:**

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    with:
      fetch-depth: 0

  # 1. Setup pnpm first (Important!)
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
      cache: 'pnpm' # Use pnpm instead of npm

  # 3. Optional: Manual cache for pnpm store
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

  # 4. Install dependencies
  - name: Install dependencies
    run: pnpm install --frozen-lockfile
```

**❌ Incorrect configuration:**

```yaml
# Wrong: Setup Node.js first with npm cache
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm' # Wrong! Project uses pnpm

# Wrong: pnpm setup comes later
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10
```

### 2. Build Failure Related Errors

#### Issue: Insufficient Permissions

**Error message:**

```
Error: Resource not accessible by integration
```

**Solution:**

```yaml
jobs:
  release:
    runs-on: ${{ matrix.os }}
    permissions:
      contents: write
      packages: write
      actions: read
```

#### Issue: Code Signing Failure

**Error message:**

```
Code signing failed
```

**Solution:**

```yaml
- name: Build and Release
  run: pnpm release:${{ matrix.platform }}
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    CSC_IDENTITY_AUTO_DISCOVERY: false # Disable auto code signing
```

### 3. Cache Related Issues

#### Issue: Cache Miss

**Symptoms:**

- Dependencies are re-downloaded every build
- Build time is too long

**Solutions:**

1. **Check cache key**:

```yaml
key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
```

2. **Ensure pnpm-lock.yaml exists**:

```bash
# Generate lock file locally
pnpm install
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml"
```

### 4. Multi-platform Build Issues

#### Issue: Specific Platform Build Failure

**Solutions:**

1. **Use fail-fast: false**:

```yaml
strategy:
  fail-fast: false # Allow other platforms to continue building
  matrix:
    include:
      - os: macos-latest
        platform: mac
      - os: windows-latest
        platform: win
      - os: ubuntu-latest
        platform: linux
```

2. **Platform-specific configuration**:

```yaml
- name: Platform-specific setup
  if: matrix.os == 'windows-latest'
  run: |
    # Windows specific configuration
```

### 5. Debugging Techniques

#### Enable Verbose Logging

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

#### Preserve Build Artifacts for Debugging

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

## Prevention Measures

### 1. Local Testing

Ensure local build succeeds before pushing to GitHub:

```bash
# Clean environment
rm -rf node_modules dist

# Reinstall dependencies
pnpm install

# Run complete build process
pnpm typecheck
pnpm lint
pnpm build
```

### 2. Regular Dependency Updates

```bash
# Update GitHub Actions
# Use latest versions in .github/workflows/*.yml

# Update pnpm
pnpm add -g pnpm@latest

# Update project dependencies
pnpm update
```

### 3. Monitor Build Status

- Set up GitHub notifications
- Use status badges to monitor build status
- Regularly check build logs

## Related Resources

- [GitHub Actions Permissions Configuration](./github-workflows-permissions.en.md)
- [GitHub Actions Best Practices](./github-workflows-best-practices.en.md)
- [Auto Release Guide](./auto-release.en.md)
- [pnpm Official Documentation](https://pnpm.io/)
- [GitHub Actions Official Documentation](https://docs.github.com/en/actions)
