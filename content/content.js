/**
 * Content Script - 在页面中运行，负责提取内容
 */

// 初始化提取器
const extractors = [
  new XiaohongshuExtractor(),
  new BaseExtractor() // 通用提取器作为后备
];

// 监听来自 sidebar 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    handleExtract()
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // 保持消息通道开启
  }
  
  if (request.action === 'checkSupport') {
    const supported = checkPlatformSupport();
    sendResponse({ supported });
    return true;
  }
});

/**
 * 检查当前平台是否支持
 */
function checkPlatformSupport() {
  const url = window.location.href;
  
  for (const extractor of extractors) {
    if (extractor.name !== 'base' && extractor.canHandle(url)) {
      return {
        supported: true,
        platform: extractor.name,
        url: url
      };
    }
  }
  
  return {
    supported: true,
    platform: 'generic',
    url: url
  };
}

/**
 * 执行内容提取
 */
async function handleExtract() {
  const url = window.location.href;
  
  // 选择合适的提取器
  let extractor = extractors.find(e => e.name !== 'base' && e.canHandle(url));
  
  if (!extractor) {
    console.log('[ContentScript] 使用通用提取器');
    extractor = extractors[extractors.length - 1]; // BaseExtractor
  } else {
    console.log(`[ContentScript] 使用 ${extractor.name} 提取器`);
  }
  
  // 提取内容
  const extracted = extractor.extract();
  
  // 转换为 Markdown
  const markdown = extractor.toMarkdown(extracted);
  
  return {
    markdown,
    metadata: {
      title: extracted.title,
      author: extracted.author,
      publishTime: extracted.publishTime,
      url: extracted.url,
      siteName: extracted.siteName,
      platform: extractor.name,
      extractedAt: new Date().toISOString()
    }
  };
}

// 页面加载完成后通知 sidebar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', notifySidebar);
} else {
  notifySidebar();
}

function notifySidebar() {
  chrome.runtime.sendMessage({
    action: 'pageReady',
    url: window.location.href
  });
}

console.log('[news-to-markdown-plugin] Content script loaded');
