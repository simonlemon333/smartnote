import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  processVideo: (videoPath: string) => ipcRenderer.invoke('process-video', videoPath),
  selectVideoFile: () => ipcRenderer.invoke('select-video-file'),
});