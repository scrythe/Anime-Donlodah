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
import { Observable, BehaviorSubject, Subject, from, Subscriber } from 'rxjs';

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
  windowSizeChange$: Subject<boolean>;

  constructor() {
    this.ipcRenderer = window.api;
    this.windowSizeChange$ = new Subject();
    this.createWindowSizeChange();
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

  isMaximized(): Observable<boolean> {
    const isMaximized = this.invoke('isMaximized');
    return from(isMaximized);
  }

  private createWindowSizeChange() {
    this.on('windowSizeChange', (_event, isMaximized) => {
      this.windowSizeChange$.next(isMaximized);
    });
  }

  windowSizeChange() {
    return new Observable<boolean>((subscriber) => {
      this.on('windowSizeChange', (_event, isMaximized) => {
        this.windowSizeChangeFunc(subscriber, isMaximized);
      });
    });
  }

  windowSizeChangeFunc(subscriber: Subscriber<boolean>, isMaximized: boolean) {
    subscriber.next(isMaximized);
  }

  test() {
    const testObservable = new Subject<string>();
    setTimeout(() => this.windowSizeChange$.next(true), 2000);
    setTimeout(() => this.windowSizeChange$.next(false), 4000);
    setTimeout(() => this.windowSizeChange$.next(true), 6000);
    return testObservable;
  }
}
