/**
 * 基础提取器 - 使用 Readability 进行通用内容提取
 */
class BaseExtractor {
  constructor() {
    this.name = 'base';
  }

  /**
   * 检测是否可以处理当前页面
   */
  canHandle(url) {
    return true; // 基础提取器可以处理任何页面
  }

  /**
   * 提取页面内容
   */
  extract() {
    try {
      // 克隆文档以避免修改原始页面
      const documentClone = document.cloneNode(true);
      
      // 使用 Readability 提取主体内容
      const reader = new Readability(documentClone, {
        debug: false,
        charThreshold: 500
      });
      
      const article = reader.parse();
      
      if (!article) {
        throw new Error('无法提取文章内容');
      }

      return {
        title: article.title || document.title,
        author: article.byline || this.extractAuthor(),
        content: article.content,
        textContent: article.textContent,
        excerpt: article.excerpt,
        siteName: article.siteName,
        url: window.location.href,
        publishTime: this.extractPublishTime()
      };
    } catch (error) {
      console.error('[BaseExtractor] 提取失败:', error);
      throw error;
    }
  }

  /**
   * 提取作者信息（备用方法）
   */
  extractAuthor() {
    const selectors = [
      'meta[name="author"]',
      'meta[property="article:author"]',
      '.author',
      '.author-name',
      '[class*="author"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const content = element.getAttribute('content') || element.textContent;
        if (content && content.trim()) {
          return content.trim();
        }
      }
    }

    return undefined;
  }

  /**
   * 提取发布时间（备用方法）
   */
  extractPublishTime() {
    const selectors = [
      'meta[property="article:published_time"]',
      'meta[name="publish-date"]',
      'time[datetime]',
      '.publish-time',
      '.post-date',
      '[class*="time"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const datetime = element.getAttribute('datetime') || 
                        element.getAttribute('content') || 
                        element.textContent;
        if (datetime && datetime.trim()) {
          return datetime.trim();
        }
      }
    }

    return undefined;
  }

  /**
   * 转换为 Markdown
   */
  toMarkdown(extracted) {
    if (!window.TurndownService) {
      throw new Error('Turndown 库未加载');
    }

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    });

    // 自定义规则：处理图片懒加载
    turndownService.addRule('lazyImages', {
      filter: 'img',
      replacement: (content, node) => {
        const src = node.getAttribute('src') || 
                   node.getAttribute('data-src') || 
                   node.getAttribute('data-original');
        const alt = node.getAttribute('alt') || '';
        
        if (!src || src.startsWith('data:image')) {
          return '';
        }
        
        return '![' + alt + '](' + src + ')';
      }
    });

    const markdown = turndownService.turndown(extracted.content);

    // 添加 frontmatter
    const frontmatter = this.generateFrontmatter(extracted);
    
    return frontmatter + '\n\n' + markdown;
  }

  /**
   * 生成 frontmatter
   */
  generateFrontmatter(extracted) {
    const parts = ['---'];
    
    if (extracted.title) {
      parts.push(`title: "${extracted.title.replace(/"/g, '\\"')}"`);
    }
    
    if (extracted.author) {
      parts.push(`author: "${extracted.author.replace(/"/g, '\\"')}"`);
    }
    
    if (extracted.publishTime) {
      parts.push(`date: "${extracted.publishTime}"`);
    }
    
    parts.push(`source_url: "${extracted.url}"`);
    
    if (extracted.siteName) {
      parts.push(`site: "${extracted.siteName}"`);
    }
    
    parts.push('---');
    
    return parts.join('\n');
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaseExtractor;
} else {
  window.BaseExtractor = BaseExtractor;
}
