const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe, secure, and context-isolated API bridge to the React frontend
contextBridge.exposeInMainWorld('electronAPI', {
  convertFiles: async (data) => {
    return ipcRenderer.invoke('convert-files', data);
  }
});
