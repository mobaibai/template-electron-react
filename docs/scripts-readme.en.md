# Scripts Directory

This directory contains auxiliary scripts for the project.

## clean-dist.js

A script to automatically clean redundant files and folders in the `dist` directory.

### Features

- **Preserved Files**:
  - Final installer files (`.exe`, `.dmg`, `.deb`, `.snap`, `.AppImage`)
  - Blockmap files (`.blockmap` - for incremental updates)
  - Auto-update configuration files (`.yml`, `.yaml`)
  - Build debug files (`builder-debug.yml`, `builder-effective-config.yaml`)

- **Deleted Files**:
  - `linux-unpacked/` - Linux build intermediate artifacts
  - `win-unpacked/` - Windows x64 build intermediate artifacts
  - `win-arm64-unpacked/` - Windows ARM64 build intermediate artifacts
  - `mac/` - macOS x64 build intermediate artifacts
  - `mac-arm64/` - macOS ARM64 build intermediate artifacts
  - Other files that don't match preservation rules

### Usage

#### Manual Cleanup

```bash
# Using npm
npm run clean:dist

# Using yarn
yarn clean:dist

# Using pnpm
pnpm clean:dist

# Direct script execution
node scripts/clean-dist.js
```

#### Automatic Cleanup

The cleanup script is integrated into the build process. The following commands will automatically execute cleanup after build completion:

- `npm run build:win` - Auto cleanup after building Windows version
- `npm run build:mac` - Auto cleanup after building macOS version
- `npm run build:linux` - Auto cleanup after building Linux version
- `npm run build:all` - Auto cleanup after building all platforms
- `npm run release` - Auto cleanup after version release
- `npm run release:all` - Auto cleanup after releasing all platforms

### Cleanup Effect

The `dist` directory before cleanup may contain numerous intermediate files, occupying several GB of space. After cleanup, only necessary installer files are preserved, typically reducing disk usage by over 80%.

### Example Output

```
Starting dist directory cleanup...
✓ Deleted folder: linux-unpacked
✓ Deleted folder: win-unpacked
✓ Deleted folder: win-arm64-unpacked
✓ Deleted folder: mac
✓ Deleted folder: mac-arm64
✓ Preserved file: TemplateElectronReact-0.0.4-setup.exe
✓ Preserved file: TemplateElectronReact-0.0.4-x64.dmg
✓ Preserved file: TemplateElectronReact-0.0.4-amd64.deb
✓ Preserved file: latest.yml

Cleanup completed!
Preserved items: 18
Deleted items: 5
Remaining total file size: 855.21 MB
```

### Notes

- Cleanup operations are irreversible. Please ensure you have backed up necessary files before cleanup
- If you need to debug the build process, you can check the contents of `unpacked` folders before cleanup
- The cleanup script only deletes predefined folders and files that don't match preservation rules, and won't affect other important files
