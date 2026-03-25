# 安装指南

## 本地开发安装

### 1. 加载插件到 Chrome

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `news-to-markdown-plugin` 文件夹

### 2. 验证安装

安装成功后，你应该能看到：
- 浏览器工具栏出现插件图标（📝）
- 插件列表中显示 "News to Markdown Plugin"

### 3. 使用插件

1. 访问支持的网站（如小红书、知乎）
2. 点击插件图标打开侧边栏
3. 点击"提取内容"按钮
4. 查看提取结果并下载 Markdown 文件

## 支持的平台

### 优先支持（已优化）
- ✅ 小红书 (xiaohongshu.com)
- ✅ 知乎 (zhihu.com)

### 通用支持
- ✅ 任何网页（使用 Readability 自动提取）

## 故障排除

### 插件无法加载
- 确保所有文件都在正确的位置
- 检查 manifest.json 是否有语法错误
- 查看 Chrome 扩展页面的错误信息

### 无法提取内容
- 确保页面已完全加载
- 检查浏览器控制台是否有错误
- 尝试刷新页面后重新提取

### 图标未显示
- 需要手动添加图标文件到 `icons/` 目录
- 或者暂时移除 manifest.json 中的图标配置

## 开发调试

### 查看日志
1. 打开 Chrome DevTools (F12)
2. 切换到 Console 标签
3. 查看以 `[news-to-markdown-plugin]` 开头的日志

### 修改代码后
1. 在 `chrome://extensions/` 页面
2. 点击插件的"重新加载"按钮
3. 刷新测试页面

## 下一步

- 添加图标文件（icon16.png, icon48.png, icon128.png）
- 测试更多网站
- 提交到 Clawhub
