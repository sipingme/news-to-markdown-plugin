/**
 * OpenClaw Plugin Entry Point
 * News to Markdown Browser Extension Plugin
 */

export default {
  id: "news-to-markdown-plugin",
  name: "News to Markdown Plugin",
  version: "1.0.0",
  description: "Extract content from websites (especially Xiaohongshu) and convert to Markdown format",
  
  /**
   * Register plugin with OpenClaw
   */
  register(api) {
    console.log('[news-to-markdown-plugin] Registering plugin...');
    
    // This is a browser extension plugin
    // The actual functionality runs in the browser via Chrome Extension APIs
    // This entry point is for OpenClaw integration
    
    // Register as a browser extension type plugin
    api.registerProvider({
      id: 'news-to-markdown-browser',
      type: 'browser-extension',
      name: 'News to Markdown Browser Extension',
      description: 'Extract content from websites and convert to Markdown',
      
      // Browser extension metadata
      extension: {
        manifest: './manifest.json',
        type: 'chrome',
        platforms: ['chrome', 'edge', 'brave']
      }
    });
    
    // Register CLI commands for plugin management
    api.registerCommand({
      name: 'news-to-markdown:status',
      description: 'Check browser extension installation status',
      handler: async () => {
        return {
          installed: true,
          version: '1.0.0',
          manifest: './manifest.json'
        };
      }
    });
    
    console.log('[news-to-markdown-plugin] Plugin registered successfully');
  }
};
