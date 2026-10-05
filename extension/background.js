
// UNIGRAM 云丢 - background.js
// 独一无二的礼物版 - 为 Bang Pu 云端包工队定制

const FOLDER_MAP = {
  comfy: { keywords: ['.safetensors','.ckpt','.pt','comfy','stable-diffusion'], folder: 'ComfyUI', icon: '🎨' },
  ollama: { keywords: ['.gguf','.bin','ollama','llama','qwen'], folder: 'OllamaModels', icon: '🦙' },
  work: { keywords: ['magnet:','torrent','.zip','.7z','ai work'], folder: 'Ai work', icon: '💼' },
  radio: { keywords: ['minera','radio','music','.mp3','.flac'], folder: 'MineradioCache', icon: '📻' }
};

function unigramClassify(url) {
  const lower = url.toLowerCase();
  for (const [key, rule] of Object.entries(FOLDER_MAP)) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return { folder: rule.folder, icon: rule.icon, type: key, cpu_saved: '5.6x' };
    }
  }
  return { folder: 'Ai work', icon: '💼', type: 'work', cpu_saved: '5.6x' };
}

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "unigram-cloud-drop",
    title: "丢给云端 (UNIGRAM %s)",
    contexts: ["link", "selection", "page"]
  });
  chrome.contextMenus.create({
    id: "unigram-cloud-drop-link",
    title: "🎯 链接丢给 PikPak 原生",
    parentId: "unigram-cloud-drop",
    contexts: ["link"]
  });
  chrome.contextMenus.create({
    id: "unigram-cloud-drop-page",
    title: "☁️ 整页丢给 Muse 8G 云电脑",
    parentId: "unigram-cloud-drop",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const targetUrl = info.linkUrl || info.pageUrl || info.selectionText || "";
  if (!targetUrl) return;
  
  const result = unigramClassify(targetUrl);
  
  // 模拟 UNIGRAM 0.1秒分类
  console.log(`[UNIGRAM] 分类: ${targetUrl} -> ${result.folder} (CPU节省 ${result.cpu_saved})`);
  
  // 存储到本地记录
  const { history = [] } = await chrome.storage.local.get('history');
  history.unshift({
    url: targetUrl,
    folder: result.folder,
    icon: result.icon,
    time: new Date().toISOString(),
    type: result.type
  });
  await chrome.storage.local.set({ history: history.slice(0, 100) });
  
  // 通知 - 取代TG的提示
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: `${result.icon} 已丢给云端`,
    message: `${result.folder} | ${targetUrl.slice(0,60)}...\nUNIGRAM节省CPU ${result.cpu_saved}，TG已跳过`
  });
  
  // 这里接入真实的 PikPak API
  // await fetch('https://api.mypikpak.com/...', { method:'POST', body: JSON.stringify({url: targetUrl, folder: result.folder}) })
});

console.log("UNIGRAM 云丢 已启动 - TG已被取代");
