// const { app, BrowserWindow } = require('electron');
// const path = require('path');
import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import IpcService from './ipcMain';

const ipc = new IpcService();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.openDevTools();

  ipc.on('minimizeApp', () => {
    mainWindow.minimize();
  });

  ipc.on('maximizeApp', () => {
    if (mainWindow.isMaximized()) mainWindow.restore();
    else mainWindow.maximize();
  });

  ipc.on('closeApp', () => {
    mainWindow.close();
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// -- Rest

// Stuff
