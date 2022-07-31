import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import {
  toMainEventNamesSend,
  toMainEventNamesInvoke,
  toMainEventParametersSend,
  toMainEventParametersInvoke,
  returnTypeBackToRendererInvoke,
  toRendererEventNames,
  toRendererEventListener,
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

  send<EventName extends toMainEventNamesSend>(
    channel: EventName,
    ...args: toMainEventParametersSend<EventName>
  ) {
    this.ipcRenderer.send(channel, args);
  }

  invoke<EventName extends toMainEventNamesInvoke>(
    channel: EventName,
    ...args: toMainEventParametersInvoke<EventName>
  ): returnTypeBackToRendererInvoke<EventName> {
    return this.ipcRenderer.invoke(
      channel,
      args
    ) as returnTypeBackToRendererInvoke<EventName>;
  }

  on<EventName extends toRendererEventNames>(
    channel: EventName,
    listener: toRendererEventListener<EventName>
  ) {
    this.ipcRenderer.on(channel, listener);
  }
}
