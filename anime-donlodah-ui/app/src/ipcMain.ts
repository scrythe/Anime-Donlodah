import { ipcMain, WebContents } from 'electron';
import {
  toMainEventNamesSend,
  toMainEventNamesInvoke,
  toMainEventListenerSend,
  toMainEventListenerInvoke,
  toRendererEventNames,
  toRendererEventParameters,
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

export type WebContentsSend = <EventName extends toRendererEventNames>(
  channel: EventName,
  ...args: toRendererEventParameters<EventName>
) => void;

export class WebContentsService {
  private webContents: WebContents;

  constructor(webContents: WebContents) {
    this.webContents = webContents;
  }

  send<EventName extends toRendererEventNames>(
    channel: EventName,
    ...args: toRendererEventParameters<EventName>
  ) {
    this.webContents.send(channel, ...args);
  }
}

export default IpcService;
