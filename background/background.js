/**
 * Background Service Worker
 * 处理插件的后台逻辑
 */

// 监听插件图标点击
chrome.action.onClicked.addListener((tab) => {
  // 打开 sidebar
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pageReady') {
    console.log('[Background] 页面已准备:', request.url);
    // 可以在这里做一些初始化工作
  }
  
  return true;
});

// 插件安装或更新时
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Background] 插件已安装');
    // 可以打开欢迎页面
  } else if (details.reason === 'update') {
    console.log('[Background] 插件已更新到版本:', chrome.runtime.getManifest().version);
  }
});

console.log('[news-to-markdown-plugin] Background service worker loaded');
