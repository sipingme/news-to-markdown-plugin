/**
 * Sidebar Script - 用户界面逻辑
 */

let currentMarkdown = '';
let currentMetadata = null;

// DOM 元素
const elements = {
  platformName: document.getElementById('platformName'),
  currentUrl: document.getElementById('currentUrl'),
  extractBtn: document.getElementById('extractBtn'),
  progress: document.getElementById('progress'),
  progressText: document.getElementById('progressText'),
  error: document.getElementById('error'),
  errorText: document.getElementById('errorText'),
  metadata: document.getElementById('metadata'),
  metaTitle: document.getElementById('metaTitle'),
  metaAuthor: document.getElementById('metaAuthor'),
  metaTime: document.getElementById('metaTime'),
  metaLength: document.getElementById('metaLength'),
  preview: document.getElementById('preview'),
  markdownContent: document.getElementById('markdownContent'),
  copyBtn: document.getElementById('copyBtn'),
  downloadSection: document.getElementById('downloadSection'),
  downloadBtn: document.getElementById('downloadBtn')
};

// 初始化
init();

function init() {
  // 绑定事件
  elements.extractBtn.addEventListener('click', handleExtract);
  elements.copyBtn.addEventListener('click', handleCopy);
  elements.downloadBtn.addEventListener('click', handleDownload);

  // 获取当前标签页信息
  getCurrentTab();
}

/**
 * 获取当前标签页
 */
async function getCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showError('无法获取当前标签页');
      return;
    }

    // 更新 URL 显示
    elements.currentUrl.textContent = tab.url;

    // 检查平台支持
    checkPlatformSupport(tab.id);
  } catch (error) {
    console.error('获取标签页失败:', error);
    showError('无法获取当前标签页信息');
  }
}

/**
 * 检查平台支持
 */
async function checkPlatformSupport(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { action: 'checkSupport' });
    
    if (response && response.supported) {
      const platformNames = {
        'xiaohongshu': '小红书',
        'zhihu': '知乎',
        'generic': '通用网页'
      };
      
      elements.platformName.textContent = platformNames[response.platform] || response.platform;
      elements.platformName.style.color = response.platform !== 'generic' ? '#34a853' : '#666';
      elements.extractBtn.disabled = false;
    } else {
      elements.platformName.textContent = '不支持';
      elements.platformName.style.color = '#d93025';
      showError('当前页面不支持内容提取');
    }
  } catch (error) {
    console.error('检查平台支持失败:', error);
    elements.platformName.textContent = '未知';
    elements.extractBtn.disabled = false; // 仍然允许尝试提取
  }
}

/**
 * 执行提取
 */
async function handleExtract() {
  hideError();
  hideResults();
  showProgress('正在提取内容...');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('无法获取当前标签页');
    }

    // 发送提取请求
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extract' });

    if (!response.success) {
      throw new Error(response.error || '提取失败');
    }

    // 保存结果
    currentMarkdown = response.data.markdown;
    currentMetadata = response.data.metadata;

    // 显示结果
    showResults();
    hideProgress();
  } catch (error) {
    console.error('提取失败:', error);
    hideProgress();
    showError(error.message || '提取内容时发生错误');
  }
}

/**
 * 复制到剪贴板
 */
async function handleCopy() {
  try {
    await navigator.clipboard.writeText(currentMarkdown);
    
    // 临时改变按钮文字
    const originalText = elements.copyBtn.innerHTML;
    elements.copyBtn.innerHTML = '<span class="icon">✓</span> 已复制';
    elements.copyBtn.disabled = true;
    
    setTimeout(() => {
      elements.copyBtn.innerHTML = originalText;
      elements.copyBtn.disabled = false;
    }, 2000);
  } catch (error) {
    console.error('复制失败:', error);
    showError('复制到剪贴板失败');
  }
}

/**
 * 下载为文件
 */
function handleDownload() {
  try {
    // 生成文件名
    const filename = generateFilename(currentMetadata);
    
    // 创建 Blob
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // 触发下载
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        showError('下载失败: ' + chrome.runtime.lastError.message);
      } else {
        console.log('下载开始:', downloadId);
      }
      
      // 清理 URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  } catch (error) {
    console.error('下载失败:', error);
    showError('下载文件时发生错误');
  }
}

/**
 * 生成文件名
 */
function generateFilename(metadata) {
  if (!metadata || !metadata.title) {
    return 'article.md';
  }
  
  // 清理标题，移除特殊字符
  let filename = metadata.title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  return filename + '.md';
}

/**
 * 显示结果
 */
function showResults() {
  // 显示元数据
  elements.metaTitle.textContent = currentMetadata.title || '-';
  elements.metaAuthor.textContent = currentMetadata.author || '-';
  elements.metaTime.textContent = currentMetadata.publishTime || '-';
  elements.metaLength.textContent = currentMarkdown.length + ' 字符';
  
  elements.metadata.style.display = 'block';
  
  // 显示 Markdown 预览（限制长度）
  const previewText = currentMarkdown.length > 5000 
    ? currentMarkdown.substring(0, 5000) + '\n\n... (内容过长，已截断预览)'
    : currentMarkdown;
  
  elements.markdownContent.textContent = previewText;
  elements.preview.style.display = 'block';
  
  // 显示下载按钮
  elements.downloadSection.style.display = 'block';
}

/**
 * 隐藏结果
 */
function hideResults() {
  elements.metadata.style.display = 'none';
  elements.preview.style.display = 'none';
  elements.downloadSection.style.display = 'none';
}

/**
 * 显示进度
 */
function showProgress(text) {
  elements.progressText.textContent = text;
  elements.progress.style.display = 'flex';
  elements.extractBtn.disabled = true;
}

/**
 * 隐藏进度
 */
function hideProgress() {
  elements.progress.style.display = 'none';
  elements.extractBtn.disabled = false;
}

/**
 * 显示错误
 */
function showError(message) {
  elements.errorText.textContent = message;
  elements.error.style.display = 'flex';
}

/**
 * 隐藏错误
 */
function hideError() {
  elements.error.style.display = 'none';
}

console.log('[news-to-markdown-plugin] Sidebar loaded');
