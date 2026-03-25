# 提交前检查清单

## 必需文件 ✅

- [x] `openclaw.plugin.json` - Clawhub 插件配置（必需）
- [x] `package.json` - NPM 包配置
- [x] `manifest.json` - Chrome 扩展配置
- [x] `README.md` - 项目文档
- [x] `INSTALL.md` - 安装指南
- [x] `CLAWHUB.md` - Clawhub 发布指南
- [x] `.gitignore` - Git 配置

## 核心代码 ✅

- [x] `lib/readability.js` - Mozilla Readability
- [x] `lib/turndown.js` - HTML to Markdown 转换器
- [x] `content/content.js` - Content Script 主入口
- [x] `content/extractors/base.js` - 基础提取器
- [x] `content/extractors/xiaohongshu.js` - 小红书提取器
- [x] `sidebar/sidebar.html` - Sidebar UI
- [x] `sidebar/sidebar.css` - 样式文件
- [x] `sidebar/sidebar.js` - Sidebar 逻辑
- [x] `background/background.js` - 后台脚本

## 待完成 ⚠️

- [ ] **图标文件** (icons/icon16.png, icon48.png, icon128.png)
  - 临时方案：可以先注释掉 manifest.json 中的图标配置
  - 或使用在线工具快速生成简单图标

- [ ] **本地测试**
  - 在 Chrome 中加载插件
  - 测试小红书页面提取
  - 测试通用网页提取
  - 验证下载功能

- [ ] **GitHub 仓库**
  - 创建仓库：news-to-markdown-plugin
  - 推送代码

## 快速开始测试

### 1. 临时移除图标要求（可选）

如果暂时没有图标，编辑 `manifest.json`，注释掉图标相关配置：

```json
// "action": {
//   "default_icon": {
//     "16": "icons/icon16.png",
//     "48": "icons/icon48.png",
//     "128": "icons/icon128.png"
//   }
// },
// "icons": {
//   "16": "icons/icon16.png",
//   "48": "icons/icon48.png",
//   "128": "icons/icon128.png"
// }
```

### 2. 加载到 Chrome

1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `news-to-markdown-plugin` 文件夹

### 3. 测试

1. 访问小红书任意笔记
2. 点击插件图标（或工具栏的拼图图标）
3. 打开 Sidebar
4. 点击"提取内容"
5. 验证 Markdown 输出
6. 测试下载功能

## 提交到 Clawhub

### 前置条件

- [ ] 本地测试通过
- [ ] 添加图标文件（或确认可以不需要）
- [ ] 代码推送到 GitHub

### 提交流程

1. 访问 Clawhub 平台
2. 提交插件信息
3. 等待 VirusTotal 扫描
4. 观察验证状态

## 预期的 Clawhub 验证

### 会通过 ✅

- 权限声明合理（activeTab, storage, downloads）
- 仅访问特定域名（小红书、知乎）
- 无恶意代码
- 符合 Manifest V3 规范

### 可能的问题 ⚠️

- 缺少图标文件（可以后续补充）
- 需要更详细的权限说明（在 manifest.json 中添加）

## 下一步行动

**立即可做**：
1. 本地测试（即使没有图标）
2. 验证核心功能是否正常

**准备发布**：
1. 添加图标文件
2. 创建 GitHub 仓库
3. 提交到 Clawhub

**后续优化**：
1. 添加知乎提取器
2. 与 wechat-md-publisher-skill 集成
3. 支持更多平台
