import { Injectable } from '@angular/core';
import { IpcRenderer, IpcRendererEvent, ipcRenderer } from 'electron';
import {
  toMainEventNamesSend,
  toMainEventNamesInvoke,
  toMainEventParametersSend,
  toMainEventParametersInvoke,
  returnTypeBackToRendererInvoke,
  toRendererEventNames,
  toRendererEventParameters,
  toRendererEventListener,
} from 'globalInterfaces/ipcInterface';
import { Observable, BehaviorSubject } from 'rxjs';

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
  isMaximized$ = new BehaviorSubject<IpcRendererEvent | string>('');
  isRestored$ = new BehaviorSubject<IpcRendererEvent | string>('');

  constructor() {
    this.ipcRenderer = window.api;

    this.on('isRestored', (event) => this.isRestored$.next(event));
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

  getIsMaximized() {
    this.on('isMaximized', (event) => this.isMaximized$.next(event));
    return this.isMaximized$.asObservable();
  }
  getIsRestored() {
    this.on('isRestored', (event) => this.isRestored$.next(event));
    return this.isRestored$.asObservable();
  }
}
