const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('lareon', {
  apps: () => ipcRenderer.invoke('apps'),
  show: (k) => ipcRenderer.send('show', k),
  onShown: (cb) => ipcRenderer.on('shown', (_e, k) => cb(k))
});
