import { ipcMain } from 'electron/main';
import { RendererEventNames, RendererEventListener } from './ipcInterface';

class IpcService {
  on<EventName extends RendererEventNames>(
    channel: EventName,
    listener: RendererEventListener<EventName>
  ) {
    ipcMain.on(channel, listener);
  }

  handle<EventName extends RendererEventNames>(
    channel: EventName,
    listener: RendererEventListener<EventName>
  ) {
    ipcMain.handle(channel, listener);
  }
}

export default IpcService;
