# Dist Directory Cleanup Example

## Dist Directory Structure Before Cleanup

```
dist/
├── TemplateElectronReact-0.0.4-amd64.deb          # ✅ Keep - Linux Deb package
├── TemplateElectronReact-0.0.4-amd64.snap         # ✅ Keep - Linux Snap package
├── TemplateElectronReact-0.0.4-arm64-setup.exe    # ✅ Keep - Windows ARM64 installer
├── TemplateElectronReact-0.0.4-arm64.dmg          # ✅ Keep - macOS ARM64 installer
├── TemplateElectronReact-0.0.4-x86_64.AppImage    # ✅ Keep - Linux AppImage package
├── *.blockmap                                     # ✅ Keep - Incremental update files
├── latest*.yml                                    # ✅ Keep - Auto-update configuration
├── builder-*.yml                                  # ✅ Keep - Build configuration files
├── linux-unpacked/                                # ❌ Delete - Linux build artifacts
│   ├── template-electron-react
│   ├── resources/
│   ├── locales/
│   └── ... (numerous Chromium files)
├── win-unpacked/                                   # ❌ Delete - Windows build artifacts
│   ├── TemplateElectronReact.exe
│   ├── resources/
│   ├── locales/
│   └── ... (numerous Chromium files)
├── win-arm64-unpacked/                             # ❌ Delete - Windows ARM64 build artifacts
│   └── ... (similar structure)
├── mac/                                            # ❌ Delete - macOS x64 build artifacts
│   └── TemplateElectronReact.app/
└── mac-arm64/                                      # ❌ Delete - macOS ARM64 build artifacts
    └── TemplateElectronReact.app/
```

## Dist Directory Structure After Cleanup

```
dist/
├── TemplateElectronReact-0.0.4-amd64.deb
├── TemplateElectronReact-0.0.4-amd64.snap
├── TemplateElectronReact-0.0.4-arm64-setup.exe
├── TemplateElectronReact-0.0.4-arm64-setup.exe.blockmap
├── TemplateElectronReact-0.0.4-arm64.dmg
├── TemplateElectronReact-0.0.4-arm64.dmg.blockmap
├── TemplateElectronReact-0.0.4-setup.exe
├── TemplateElectronReact-0.0.4-setup.exe.blockmap
├── TemplateElectronReact-0.0.4-x64-setup.exe
├── TemplateElectronReact-0.0.4-x64-setup.exe.blockmap
├── TemplateElectronReact-0.0.4-x64.dmg
├── TemplateElectronReact-0.0.4-x64.dmg.blockmap
├── TemplateElectronReact-0.0.4-x86_64.AppImage
├── builder-debug.yml
├── builder-effective-config.yaml
├── latest-linux.yml
├── latest-mac.yml
└── latest.yml
```

## Cleanup Effect Comparison

| Item                  | Before Cleanup | After Cleanup | Space Saved |
| --------------------- | -------------- | ------------- | ----------- |
| Files/Folders Count   | ~23 items      | 18 items      | ~22%        |
| Disk Usage            | ~4.2 GB        | ~855 MB       | ~80%        |
| Functional Files Kept | ✅ Complete    | ✅ Complete   | No Impact   |

## Cleanup Rules Explanation

### File Types to Keep

1. **Installation Package Files**
   - `.exe` - Windows installers
   - `.dmg` - macOS disk images
   - `.deb` - Debian/Ubuntu packages
   - `.snap` - Ubuntu Snap packages
   - `.AppImage` - Linux portable applications

2. **Update Related Files**
   - `.blockmap` - Incremental update mapping files
   - `latest*.yml` - Auto-update configuration files

3. **Debug Configuration Files**
   - `builder-debug.yml` - Build debug information
   - `builder-effective-config.yaml` - Effective build configuration

### File Types to Delete

1. **Build Artifacts**
   - `*-unpacked/` folders - Unpacked application files
   - `mac/` and `mac-arm64/` folders - macOS application bundles

2. **Redundant Files**
   - Other files that don't match the retention rules

## Usage Recommendations

1. **Automatic Cleanup**: Recommended to use integrated build commands that automatically perform cleanup
2. **Manual Cleanup**: If you need to clean separately, use `pnpm clean:dist`
3. **Debugging Needs**: If you need to debug build artifacts, check unpacked folders before cleanup
4. **Backup Important Files**: Cleanup operations are irreversible, ensure important files are backed up

## Benefits of Cleanup

1. **Storage Efficiency**: Reduces disk usage by over 80%
2. **CI/CD Performance**: Faster artifact uploads and downloads
3. **Cost Reduction**: Lower storage and transfer costs in CI environments
4. **Clean Workspace**: Easier to identify and manage final distribution files
5. **Version Control**: Prevents accidentally committing large build artifacts

## Integration with CI/CD

The cleanup script is automatically integrated into the GitHub Actions workflow:

```yaml
- name: Clean dist directory
  run: pnpm clean:dist
  if: always() # Ensures cleanup runs even if build fails
```

This ensures that CI runners maintain optimal performance and storage usage.
