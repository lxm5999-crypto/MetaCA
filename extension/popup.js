
chrome.storage.local.get('history', ({history=[]})=>{
  const div=document.getElementById('history');
  if(!history.length){ div.innerHTML='<div class=small>还没有丢过，右键试试？</div>'; return; }
  div.innerHTML = '<div style="font-size:12px;margin:8px 0">最近丢的:</div>' + history.slice(0,5).map(h=>
    `<div class="card"><div class="small">${new Date(h.time).toLocaleTimeString()}</div><div class="folder">${h.icon} ${h.folder}</div><div class="small" style="word-break:break-all">${h.url.slice(0,50)}</div></div>`
  ).join('');
});
document.getElementById('openPikpak').onclick=()=>chrome.tabs.create({url:'https://mypikpak.com'});
