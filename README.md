## template-electron-react脚手架

### 问题
```
如使用 Pnpm 会有软链相关问题，可不用 Pnpm
```

### 功能

#### 图标
```
项目图标方案采用 unocss 生态，使用了 icones 作为图标源，一次性安装了 @iconify/json 解决各个环境图标对SVG不稳定支持的问题(图标采用css注入的方式)，同时也扩大了图标的选择范围

经测试，windows、macos正常显示
```

#### 配色
```
项目借鉴了unocss彩虹主题色的配色方案
```

### 使用
```
npm install

npm run dev

npm run build:mac(只限于macos系统)
npm run build:win
```

### 预览
![预览.gif](https://files.catbox.moe/12faop.gif)
