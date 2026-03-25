/**
 * 小红书专用提取器
 * 针对小红书的特殊 DOM 结构进行优化
 */
class XiaohongshuExtractor extends BaseExtractor {
  constructor() {
    super();
    this.name = 'xiaohongshu';
  }

  canHandle(url) {
    return url.includes('xiaohongshu.com') || url.includes('xhs.cn');
  }

  extract() {
    try {
      // 小红书笔记页面的特定选择器
      const title = this.extractTitle();
      const author = this.extractAuthor();
      const content = this.extractContent();
      const publishTime = this.extractPublishTime();

      if (!content) {
        // 如果小红书特定提取失败，回退到基础提取器
        console.warn('[XiaohongshuExtractor] 特定提取失败，使用基础提取器');
        return super.extract();
      }

      return {
        title: title || document.title,
        author: author,
        content: content,
        textContent: this.getTextContent(content),
        url: window.location.href,
        publishTime: publishTime,
        siteName: '小红书'
      };
    } catch (error) {
      console.error('[XiaohongshuExtractor] 提取失败，回退到基础提取器:', error);
      return super.extract();
    }
  }

  extractTitle() {
    const selectors = [
      '#detail-title',
      '.title',
      '[class*="note-title"]',
      'h1'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }

    return document.title.replace(/\s*-\s*小红书.*$/, '').trim();
  }

  extractAuthor() {
    const selectors = [
      '.author-name',
      '[class*="user-name"]',
      '[class*="author"]',
      '.username'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }

    return super.extractAuthor();
  }

  extractContent() {
    const selectors = [
      '#detail-desc',
      '.note-content',
      '[class*="note-text"]',
      '[class*="content-container"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // 克隆元素以避免修改原始 DOM
        const clone = element.cloneNode(true);
        
        // 处理图片
        this.processImages(clone);
        
        return clone.innerHTML;
      }
    }

    return null;
  }

  extractPublishTime() {
    const selectors = [
      '.publish-time',
      '[class*="time"]',
      'time'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const time = element.getAttribute('datetime') || element.textContent;
        if (time && time.trim()) {
          return time.trim();
        }
      }
    }

    return super.extractPublishTime();
  }

  /**
   * 处理小红书的图片（懒加载、防盗链等）
   */
  processImages(container) {
    const images = container.querySelectorAll('img');
    
    images.forEach(img => {
      // 小红书图片可能使用 data-src 或其他属性
      const src = img.getAttribute('src') || 
                 img.getAttribute('data-src') || 
                 img.getAttribute('data-original');
      
      if (src && !src.startsWith('data:image')) {
        img.setAttribute('src', src);
      }
    });
  }

  /**
   * 获取纯文本内容
   */
  getTextContent(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiaohongshuExtractor;
} else {
  window.XiaohongshuExtractor = XiaohongshuExtractor;
}
