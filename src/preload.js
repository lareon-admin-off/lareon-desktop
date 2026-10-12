const { contextBridge, ipcRenderer } = require('electron');
// Only Lareon's own pages (Home and setup) get this bridge. The product sites inside the app do not.
contextBridge.exposeInMainWorld('lareon', {
  apps: () => ipcRenderer.invoke('apps'),
  show: (k) => ipcRenderer.send('show', k),
  onShown: (cb) => ipcRenderer.on('shown', (_e, k) => cb(k)),
  onNote: (cb) => ipcRenderer.on('note', (_e, m) => cb(m)),
  session: () => ipcRenderer.invoke('auth:session'),
  onSession: (cb) => ipcRenderer.on('session', (_e, u) => cb(u)),
  login: (c) => ipcRenderer.invoke('auth:login', c),
  verify2fa: (c) => ipcRenderer.invoke('auth:verify', c),
  checkUsername: (u) => ipcRenderer.invoke('auth:check-username', u),
  register: (d) => ipcRenderer.invoke('auth:register', d),
  resetRequest: (u) => ipcRenderer.invoke('auth:reset-request', u),
  resetVerify: (d) => ipcRenderer.invoke('auth:reset-verify', d),
  legal: (n) => ipcRenderer.invoke('legal:get', n),
  summary: () => ipcRenderer.invoke('account:summary'),
  menu: (pos) => ipcRenderer.send('menu:account', pos),
  openExternal: (u) => ipcRenderer.send('open-external', u),
  info: () => ipcRenderer.invoke('app:info'),
  setLang: (l) => ipcRenderer.send('app:lang', l),
  onLang: (cb) => ipcRenderer.on('lang', (_e, l) => cb(l)),
  onLoading: (cb) => ipcRenderer.on('loading', (_e, v) => cb(v)),
  onPalette: (cb) => ipcRenderer.on('palette', () => cb()),
  homeData: () => ipcRenderer.invoke('home:data'),
  addTask: (t) => ipcRenderer.invoke('home:add-task', t),
  doneTask: (id, d) => ipcRenderer.invoke('home:done-task', id, d),
  signOut: () => ipcRenderer.send('auth:signout'),
  checkUpdates: () => ipcRenderer.send('app:check-updates')
});
contextBridge.exposeInMainWorld('setup', {
  state: () => ipcRenderer.invoke('setup:state'),
  save: (s) => ipcRenderer.invoke('setup:save', s),
  testNotification: () => ipcRenderer.send('setup:test-notification'),
  finish: () => ipcRenderer.send('setup:finish')
});
