import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron';
import {
  toMainEventNames,
  toMainEventParameters,
  returnTypeBackToRenderer,
  toRendererEventNames,
  toRendererEventListener,
  toRendererEventParameters,
  EventListenerArgs,
} from '../../globalInterfaces/ipcInterface';
import { IpcMainToRenderer } from '../../globalInterfaces/ipcInterfaceOld';

contextBridge.exposeInMainWorld('api', {
  send<EventName extends toMainEventNames>(
    channel: EventName,
    ...args: toMainEventParameters<EventName>
  ) {
    ipcRenderer.send(channel, args);
  },

  invoke<EventName extends toMainEventNames>(
    channel: EventName,
    ...args: toMainEventParameters<EventName>
  ): returnTypeBackToRenderer<EventName> {
    return ipcRenderer.invoke(
      channel,
      args
    ) as returnTypeBackToRenderer<EventName>;
  },

  on<EventName extends toRendererEventNames>(
    channel: EventName,
    listener: toRendererEventListener<EventName>
  ) {
    channel;
    listener;
    // ipcRenderer.on(channel, listener);
  },
});

const test = <EventName extends toRendererEventNames>(
  channel: EventName,
  listener: toRendererEventListener<EventName>
) => {
  channel;
  listener;
  ipcRenderer.on(channel, listener);
};

const test2 = <EventName extends toRendererEventNames>(
  _channel: EventName,
  args: EventListenerArgs<IpcMainToRenderer, EventName>
) => {
  const test: any[] = args;
  test;
};

// test('isMaximized', (event) => {});
