import { ipcMain } from 'electron';
import {
  toMainEventNamesSend,
  toMainEventNamesInvoke,
  toMainEventListenerSend,
  toMainEventListenerInvoke,
} from '../../globalInterfaces/ipcInterface';

class IpcService {
  on<EventName extends toMainEventNamesSend>(
    channel: EventName,
    listener: toMainEventListenerSend<EventName>
  ) {
    ipcMain.on(channel, listener);
  }

  handle<EventName extends toMainEventNamesInvoke>(
    channel: EventName,
    listener: toMainEventListenerInvoke<EventName>
  ) {
    ipcMain.handle(channel, listener);
  }
}

export default IpcService;
