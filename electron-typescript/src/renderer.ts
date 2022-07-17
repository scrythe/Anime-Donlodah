import IpcService from './ipcRenderer.js';
const ipc = new IpcService();

const minimizeBtn = document.querySelector(
  '.topBar .titleBtns .minimizeBtn'
) as HTMLButtonElement;
const maximizeBtn = document.querySelector(
  '.topBar .titleBtns .maximizeBtn'
) as HTMLButtonElement;
const closeBtn = document.querySelector(
  '.topBar .titleBtns .closeBtn'
) as HTMLButtonElement;

minimizeBtn.addEventListener('click', () => ipc.send('minimizeApp'));
maximizeBtn.addEventListener('click', () => ipc.send('maximizeApp'));
closeBtn.addEventListener('click', () => ipc.send('closeApp'));
