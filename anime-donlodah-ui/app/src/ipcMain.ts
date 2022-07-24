import { ipcMain } from 'electron';
import {
  RendererEventNames,
  RendererEventListener,
} from '../../globalInterfaces/ipcInterface';

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
