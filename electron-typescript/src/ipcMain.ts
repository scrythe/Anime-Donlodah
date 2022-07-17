import { ipcMain } from 'electron/main';
import { EventNames, EventListener } from './ipcInterface';

class IpcService {
  on<EventName extends EventNames>(
    channel: EventName,
    listener: EventListener<EventName>
  ) {
    ipcMain.on(channel, listener);
  }

  handle<EventName extends EventNames>(
    channel: EventName,
    listener: EventListener<EventName>
  ) {
    ipcMain.handle(channel, listener);
  }
}

export default IpcService;
