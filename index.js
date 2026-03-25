/**
 * News to Markdown Plugin - OpenClaw Browser Extension Entry
 * 
 * This is a browser extension plugin for OpenClaw/ClawHub.
 * Unlike backend skill plugins that use defineSkill(), browser extensions
 * export configuration and metadata for ClawHub integration.
 */

module.exports = {
  // Plugin metadata
  name: 'news-to-markdown-plugin',
  version: '1.0.0',
  type: 'browser_extension',
  description: 'Extract content from websites (especially Xiaohongshu) and convert to Markdown format',
  
  // Configuration schema for ClawHub
  configSchema: {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "News to Markdown Plugin Configuration",
    "description": "Configuration options for the News to Markdown browser extension plugin",
    "additionalProperties": false,
    "properties": {
      "enabled": {
        "type": "boolean",
        "title": "Enable Plugin",
        "description": "Enable or disable the plugin",
        "default": true
      },
      "autoDownload": {
        "type": "boolean",
        "title": "Auto Download",
        "description": "Automatically download extracted content as .md file",
        "default": false
      },
      "defaultPlatform": {
        "type": "string",
        "title": "Default Platform",
        "description": "Default platform extractor to use",
        "enum": ["xiaohongshu", "zhihu", "generic"],
        "default": "generic"
      },
      "includeFrontmatter": {
        "type": "boolean",
        "title": "Include Frontmatter",
        "description": "Include frontmatter metadata in generated Markdown",
        "default": true
      }
    },
    "required": []
  },
  
  // Default configuration
  defaultConfig: {
    enabled: true,
    autoDownload: false,
    defaultPlatform: 'generic',
    includeFrontmatter: true
  },
  
  // Browser extension specific info
  browserExtension: {
    manifest: 'manifest.json',
    type: 'chrome',
    manifestVersion: 3,
    platforms: ['chrome', 'edge', 'brave']
  }
};
