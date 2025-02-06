const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    receiveParams: (callback) => ipcRenderer.on('params', (event, args) => callback(args))
});
