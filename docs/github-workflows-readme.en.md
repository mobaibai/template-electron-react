# GitHub Actions Workflow Documentation

## Overview

This project uses GitHub Actions to automate the build and release process, supporting cross-platform builds with automatic cleanup of build artifacts.

## Workflow Files

### `build-and-release.yml`

The main build and release workflow with the following features:

#### Trigger Conditions

- **Automatic Trigger**: When pushing tags matching `v*.*.*` format
- **Manual Trigger**: Through GitHub Actions interface

#### Build Matrix

- **macOS**: x64 and arm64 architectures
- **Windows**: x64 and arm64 architectures
- **Linux**: x64 architecture

#### Main Steps

1. **Code Checkout**: Fetch complete Git history
2. **Environment Setup**: Node.js 22 + pnpm 10
3. **Dependency Caching**: Optimize build speed
4. **Dependency Installation**: Using `pnpm install --frozen-lockfile`
5. **Code Validation**: Type checking and ESLint
6. **Build and Release**: Execute platform-specific build commands
7. **Cleanup Build Artifacts**: Automatically clean redundant files in dist directory
8. **Error Handling**: Upload build logs on failure

## Cleanup Functionality

### Automatic Cleanup

The workflow automatically executes cleanup steps after build completion:

```yaml
- name: Clean dist directory
  run: pnpm clean:dist
  if: always()
```

### Cleanup Effects

- **Before Cleanup**: dist directory may contain 4GB+ files
- **After Cleanup**: Only ~855MB of necessary files retained
- **Space Saved**: Reduces disk usage by 80%+

### Retained Files

After cleanup, only the following necessary files are retained:

- Platform installation packages (`.exe`, `.dmg`, `.AppImage`, `.deb`, `.snap`)
- Auto-update configuration files (`latest*.yml`)
- Verification files (`*.blockmap`)
- Build configuration files (`builder-*.yml`)

### Deleted Files

The cleanup process removes the following redundant files:

- Unpacked application directories (`*-unpacked/`)
- Temporary build folders (`mac*/`, `win*/`, `linux*/`)
- Application bundle contents (`*.app/`, `Contents/`, `Resources/`)
- Localization files (`*.lproj/`)

## Environment Variables

### Required Secrets

- `GITHUB_TOKEN`: For publishing to GitHub Releases (automatically provided)

### Optional Secrets

- `CSC_LINK`: macOS code signing certificate
- `CSC_KEY_PASSWORD`: Certificate password
- `WIN_CSC_LINK`: Windows code signing certificate
- `WIN_CSC_KEY_PASSWORD`: Windows certificate password

## Best Practices

### 1. Tag Naming Convention

Use semantic versioning tags:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. Build Optimization

- Use pnpm cache to accelerate dependency installation
- Parallel builds for multiple platforms
- Automatic cleanup to reduce storage usage

### 3. Error Handling

- Automatically upload logs on build failure
- Use `fail-fast: false` to ensure other platforms continue building
- Cleanup step uses `if: always()` to ensure it always executes

### 4. Security Considerations

- Disable automatic code signing discovery (`CSC_IDENTITY_AUTO_DISCOVERY: false`)
- Use minimal privilege GitHub Token
- Manage sensitive information through Secrets

## Troubleshooting

### Common Issues

1. **Build Failure**
   - Check Actions logs
   - Verify dependency version compatibility
   - Confirm code signing configuration

2. **Release Failure**
   - Check GitHub Token permissions
   - Verify tag format
   - Confirm repository settings

3. **Cleanup Failure**
   - Check `scripts/clean-dist.js` file
   - Verify Node.js version compatibility
   - Review cleanup script logs

### Debugging Tips

1. **Local Testing**:

   ```bash
   pnpm release:linux
   pnpm clean:dist
   ```

2. **View Build Artifacts**:

   ```bash
   ls -la dist/
   ```

3. **Manual Workflow Trigger**:
   - Use "Run workflow" button on GitHub Actions page

## Related Documentation

- [Build Scripts Documentation](../../scripts/README.md)
- [Cleanup Effects Example](../../scripts/clean-dist-example.md)
- [Automated Release Guide](../../docs/auto-release.en.md)
- [electron-builder Configuration](../../electron-builder.yml)
