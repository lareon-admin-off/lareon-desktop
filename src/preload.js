const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('lareon', {
  apps: () => ipcRenderer.invoke('apps'),
  show: (k) => ipcRenderer.send('show', k),
  onShown: (cb) => ipcRenderer.on('shown', (_e, k) => cb(k))
});
// Only the setup wizard page uses these
contextBridge.exposeInMainWorld('setup', {
  state: () => ipcRenderer.invoke('setup:state'),
  save: (s) => ipcRenderer.invoke('setup:save', s),
  testNotification: () => ipcRenderer.send('setup:test-notification'),
  signinStart: () => ipcRenderer.send('setup:signin-start'),
  signinBounds: (b) => ipcRenderer.send('setup:signin-bounds', b),
  signinHide: () => ipcRenderer.send('setup:signin-hide'),
  onSignedIn: (cb) => ipcRenderer.on('setup:signed-in', (_e, who) => cb(who)),
  finish: () => ipcRenderer.send('setup:finish')
});
