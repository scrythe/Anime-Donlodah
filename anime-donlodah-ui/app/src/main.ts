import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import IpcService, { WebContentsService } from './ipcMain';

const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');

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

  if (serve) {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
    const electronReload = require('electron-reloader');
    electronReload(module, {});
  } else {
    mainWindow.loadFile('index.html');
  }

  const webContentsService = new WebContentsService(mainWindow.webContents);

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

  mainWindow.on('maximize', () => {
    webContentsService.send('isMaximized');
  });

  mainWindow.on('unmaximize', () => {
    webContentsService.send('isRestored');
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
