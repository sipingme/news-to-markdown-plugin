# news-to-markdown-plugin

浏览器插件版本的 news-to-markdown，专门用于提取难以通过后端抓取的网站内容（如小红书、知乎等）。

## 架构设计

### 与 news-to-markdown 的对比

| 组件 | news-to-markdown (Node.js) | news-to-markdown-plugin (Browser) |
|------|---------------------------|-----------------------------------|
| **内容提取** | DualExtractor (Readability + NewsExtractor) | Readability.js (浏览器版) |
| **Markdown 转换** | @siping/html-to-markdown-node | Turndown.js |
| **运行环境** | Node.js 后端 | 浏览器前端 |
| **适用场景** | 可后端抓取的网站 | 需要登录/有反爬虫的网站 |

### 技术栈

```
┌─────────────────────────────────────────────────────────┐
│           news-to-markdown-plugin (浏览器插件)            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. 内容提取层                                             │
│     ├─ Readability.js (Mozilla)                          │
│     │  - 智能提取主体内容                                  │
│     │  - 保留图片和结构                                    │
│     │                                                     │
│     └─ 平台特定提取器 (可选)                               │
│        ├─ xiaohongshu.js (小红书)                        │
│        ├─ zhihu.js (知乎)                                │
│        └─ weibo.js (微博)                                │
│                                                           │
│  2. Markdown 转换层                                       │
│     └─ Turndown.js                                       │
│        - HTML → Markdown 转换                            │
│        - 支持自定义规则                                   │
│        - 处理图片、链接、表格                             │
│                                                           │
│  3. 输出层                                                │
│     ├─ 下载为 .md 文件                                    │
│     └─ 发送到 wechat-md-publisher-skill                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 核心依赖

### 1. Readability.js
- **来源**: Mozilla (@mozilla/readability)
- **用途**: 智能提取网页主体内容
- **优势**: 
  - 与 news-to-markdown 使用相同的提取引擎
  - 浏览器原生支持
  - 提取质量高

### 2. Turndown.js
- **来源**: domchristie/turndown
- **用途**: HTML 转 Markdown
- **优势**:
  - 专为浏览器设计
  - 支持自定义规则
  - 与 html-to-markdown-node 功能相似

## 支持的平台

### 优先级 1（已实现）
- ✅ 小红书 (xiaohongshu.com)
- ✅ 知乎 (zhihu.com)

### 优先级 2（计划中）
- ⏳ 微博 (weibo.com)
- ⏳ B站动态 (bilibili.com)
- ⏳ 豆瓣 (douban.com)

### 通用支持
- ✅ 任何网页（使用 Readability 自动提取）

## 使用流程

1. **用户浏览目标网页**（如小红书笔记）
2. **点击插件图标**
3. **插件自动提取内容并转换为 Markdown**
4. **选择输出方式**：
   - 下载为 .md 文件
   - 发送到 wechat-md-publisher-skill
   - 复制到剪贴板

## 与其他工具的集成

### 与 news-to-markdown-skill 的关系
- **互补关系**：
  - `news-to-markdown-skill`: 处理可后端抓取的网站
  - `news-to-markdown-plugin`: 处理需要浏览器环境的网站

### 与 wechat-md-publisher-skill 的集成
- 插件生成 Markdown 文件
- 用户可以直接发送到 wechat-md-publisher-skill
- 或者下载后手动使用 wechat-md-publisher-skill 发布

## 开发计划

- [x] 项目架构设计
- [x] 集成 Readability.js
- [x] 集成 Turndown.js
- [x] 实现小红书提取器
- [x] 实现基础提取器（通用网页）
- [x] 实现 Sidebar UI 界面
- [x] 添加 package.json
- [ ] 添加图标文件
- [ ] 本地测试
- [ ] 实现知乎提取器
- [ ] 提交到 Clawhub

## Clawhub 发布

### 准备清单

- [x] `openclaw.plugin.json` - Clawhub 插件配置（必需）
- [x] `package.json` - NPM 包配置
- [x] `manifest.json` - 浏览器扩展配置
- [x] `README.md` - 项目文档
- [ ] 图标文件 (icon16.png, icon48.png, icon128.png)
- [ ] 使用截图
- [ ] 测试验证

### 提交步骤

1. 确保所有文件就绪
2. 创建 GitHub 仓库
3. 推送代码到 GitHub
4. 在 Clawhub 提交插件
5. 等待审核（VirusTotal 扫描等）

## 技术细节

### 为什么不直接复用 @siping/html-to-markdown-node？

`@siping/html-to-markdown-node` 依赖 JSDOM（Node.js 环境），无法在浏览器中运行。

**解决方案**：
- 使用 Turndown.js 替代（功能相似，浏览器兼容）
- 保持转换质量一致
- 未来可以考虑将 html-to-markdown-node 改造为浏览器兼容版本

### 为什么使用 Readability.js？

- Mozilla Readability 是业界标准
- news-to-markdown 也使用它作为主要提取引擎
- 保证提取质量一致性
