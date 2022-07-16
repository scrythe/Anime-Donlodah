// const { app, BrowserWindow } = require('electron');
// const path = require('path');
import { app, BrowserWindow } from 'electron';
import { join } from 'path';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
    // frame: false,
    // autoHideMenuBar: true,
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.openDevTools();
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
