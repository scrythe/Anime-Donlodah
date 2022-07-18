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

function changeMaximizeRestoreBtn(isMaximized: boolean) {
  if (isMaximized) {
    maximizeBtn.title = 'Restore';
    maximizeBtn.classList.remove('maximizeBtn');
    maximizeBtn.classList.add('restoreBtn');
    maximizeBtn.innerHTML = '<i class="fa-regular fa-window-restore"></i>';
  } else {
    maximizeBtn.title = 'Maximize';
    maximizeBtn.classList.add('maximizeBtn');
    maximizeBtn.classList.remove('restoreBtn');
    maximizeBtn.innerHTML = '<i class="fa-regular fa-square"></i>';
  }
}

ipc.on('isMaximized', () => changeMaximizeRestoreBtn(true));
ipc.on('isRestored', () => changeMaximizeRestoreBtn(false));
