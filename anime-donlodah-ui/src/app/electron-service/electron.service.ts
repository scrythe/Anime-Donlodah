import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import {
  RendererEventNames,
  RendererEventParameters,
  RendererEventReturnType,
  MainEventNames,
  MainEventListener,
} from 'globalInterfaces/ipcInterface';

declare global {
  interface Window {
    api: IpcRenderer;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  ipcRenderer: IpcRenderer;

  constructor() {
    this.ipcRenderer = window.api;
  }

  send<EventName extends RendererEventNames>(
    channel: EventName,
    ...args: RendererEventParameters<EventName>
  ) {
    this.ipcRenderer.send(channel, args);
  }

  invoke<EventName extends RendererEventNames>(
    channel: EventName,
    ...args: RendererEventParameters<EventName>
  ): RendererEventReturnType<EventName> {
    return this.ipcRenderer.invoke(
      channel,
      args
    ) as RendererEventReturnType<EventName>;
  }

  on<EventName extends MainEventNames>(
    channel: EventName,
    listener: MainEventListener<EventName>
  ) {
    this.ipcRenderer.on(channel, listener);
  }
}
