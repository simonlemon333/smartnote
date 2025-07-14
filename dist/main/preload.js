"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    processVideo: (videoPath) => electron_1.ipcRenderer.invoke('process-video', videoPath),
    selectVideoFile: () => electron_1.ipcRenderer.invoke('select-video-file'),
});
