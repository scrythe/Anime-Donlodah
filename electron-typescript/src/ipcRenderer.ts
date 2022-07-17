import { IpcRenderer } from 'electron';
import { EventNames, EventParameters, EventReturnType } from './ipcInterface';

declare global {
  interface Window {
    api: IpcRenderer;
  }
}

class IpcService {
  private ipcRenderer = window.api;

  send<EventName extends EventNames>(
    channel: EventName,
    ...args: EventParameters<EventName>
  ) {
    this.ipcRenderer.send(channel, args);
  }

  invoke<EventName extends EventNames>(
    channel: EventName,
    ...args: EventParameters<EventName>
  ): Promise<EventReturnType<EventName>> {
    return this.ipcRenderer.invoke(channel, args) as Promise<
      EventReturnType<EventName>
    >;
  }
}

export default IpcService;
