# Clawhub 发布指南

## 关于 Clawhub

Clawhub 是一个浏览器插件分发平台，提供代码验证和安全扫描服务。

## 发布流程

### 1. 云端验证阶段

当你提交插件后，Clawhub 会自动执行：

- **安全扫描**：VirusTotal 扫描 + 静态代码分析
- **权限检查**：验证 manifest.json 中的权限声明
- **代码审核**：检查是否符合 Manifest V3 规范
- **版本锁定**：生成不可篡改的插件包

### 2. 客户端执行阶段

用户安装后：

1. 用户打开目标网页（如小红书）
2. 点击插件图标打开 Sidebar
3. 插件在浏览器中运行 Readability.js 提取内容
4. 本地转换为 Markdown
5. 用户下载 .md 文件

**关键优势**：
- 插件在用户浏览器中运行，已通过网站的所有验证
- 无需后端服务器
- 绕过反爬虫机制

## 为什么使用 Clawhub？

### vs 本地安装

| 特性 | 本地安装 | Clawhub |
|------|---------|---------|
| 信任度 | 低（未签名警告） | 高（平台验证） |
| 自动更新 | ❌ | ✅ |
| 团队共享 | 困难 | 简单 |
| 安全保证 | 无 | VirusTotal 扫描 |

### vs Chrome Web Store

| 特性 | Chrome Web Store | Clawhub |
|------|-----------------|---------|
| 审核时间 | 数天-数周 | 较快 |
| 审核严格度 | 极高 | 适中 |
| 开发者友好 | 一般 | 较好 |

## 准备提交

### 必需文件

```
news-to-markdown-plugin/
├── package.json          ✅ 必需
├── manifest.json         ✅ 必需
├── README.md            ✅ 推荐
├── icons/               ⚠️ 需要添加
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── [其他源代码文件]
```

### 提交前检查

- [ ] `package.json` 包含正确的元数据
- [ ] `manifest.json` 符合 Manifest V3 规范
- [ ] 所有权限都有合理说明
- [ ] 代码中无恶意域名请求
- [ ] 图标文件已添加
- [ ] 本地测试通过

## 提交步骤

### 1. 创建 GitHub 仓库

```bash
cd /Users/siping/Documents/AI/2026/markdown/news-to-markdown-plugin
git init
git add .
git commit -m "Initial commit: news-to-markdown browser plugin"
git remote add origin https://github.com/sipingme/news-to-markdown-plugin.git
git push -u origin main
```

### 2. 在 Clawhub 提交

1. 访问 Clawhub 网站
2. 点击 "Submit Plugin"
3. 填写项目信息：
   - **名称**: news-to-markdown-plugin
   - **描述**: Extract content from websites and convert to Markdown
   - **GitHub URL**: https://github.com/sipingme/news-to-markdown-plugin
4. 等待验证

### 3. 观察验证状态

- **Pending**: 正在进行 VirusTotal 扫描
- **Approved**: 验证通过，可以发布
- **Rejected**: 验证失败，查看原因并修复

## 常见问题

### Q: 权限声明会被拒绝吗？

A: 我们的插件使用的权限都是合理的：
- `activeTab`: 访问当前标签页（提取内容）
- `storage`: 保存用户配置
- `downloads`: 下载 Markdown 文件
- `host_permissions`: 仅限小红书、知乎等特定网站

### Q: 如何更新插件？

A: 
1. 更新代码
2. 修改 `package.json` 和 `manifest.json` 中的版本号
3. 推送到 GitHub
4. 在 Clawhub 提交新版本

### Q: 用户如何安装？

A: 
1. 用户在 Clawhub 找到插件
2. 点击安装
3. 浏览器自动下载并安装
4. 所有用户自动获得更新

## 下一步

1. 添加图标文件
2. 本地测试验证
3. 创建 GitHub 仓库
4. 提交到 Clawhub
