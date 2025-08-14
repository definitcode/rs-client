// In preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  resizeWindow: () => ipcRenderer.send('resize-window')
});
