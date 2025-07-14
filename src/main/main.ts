import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

let mainWindow: BrowserWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:9000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('process-video', async (event, videoPath: string) => {
  try {
    console.log('Processing video:', videoPath);
    
    // Create form data
    const form = new FormData();
    const videoStream = fs.createReadStream(videoPath);
    form.append('video', videoStream);
    
    // Send to Python backend
    const response = await fetch('http://localhost:5000/process-video', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    const result = await response.json() as any;
    
    if (response.ok) {
      return {
        success: true,
        transcription: result.transcription,
        summary: result.summary
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error) {
    console.error('Error processing video:', error);
    return {
      success: false,
      error: 'Failed to process video'
    };
  }
});

ipcMain.handle('select-video-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'mkv', 'avi', 'mov'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  
  return null;
});