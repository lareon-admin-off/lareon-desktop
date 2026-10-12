// Runs inside the Lareon sites (Dusk, Fledge, Aster, Account) before their own scripts, so they find you already signed in.
// It also gives Lareon's own error page two buttons and the app language.
const { ipcRenderer, contextBridge } = require('electron');
try {
  const r = ipcRenderer.sendSync('view:token');
  if (r && r.t) { if (localStorage.getItem('lt') !== r.t) { localStorage.setItem('lt', r.t); localStorage.setItem('lu', r.u); } }
} catch (e) {}
try { if (location.protocol === 'file:') contextBridge.exposeInMainWorld('themePref', ipcRenderer.sendSync('theme:get')); } catch (e) {}
try {
  if (location.protocol === 'file:') contextBridge.exposeInMainWorld('lv', {
    home: () => ipcRenderer.send('show', 'home'),
    help: () => ipcRenderer.send('show', 'help'),
    lang: () => ipcRenderer.invoke('app:info').then((i) => i.lang || i.locale || 'en')
  });
} catch (e) {}
