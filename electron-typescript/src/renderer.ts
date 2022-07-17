import IpcService from './ipcRenderer.js';
const ipc = new IpcService();
ipc.send('yeet');
const a = ipc.invoke('lol');
a.then((data) => console.log(data));
