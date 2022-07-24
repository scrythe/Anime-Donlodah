import { ipcRenderer, contextBridge } from 'electron';
import {
  RendererEventNames,
  RendererEventParameters,
  RendererEventReturnType,
  MainEventNames,
  MainEventListener,
} from './ipcInterface';

contextBridge.exposeInMainWorld('api', {
  send<EventName extends RendererEventNames>(
    channel: EventName,
    ...args: RendererEventParameters<EventName>
  ) {
    ipcRenderer.send(channel, args);
  },

  invoke<EventName extends RendererEventNames>(
    channel: EventName,
    ...args: RendererEventParameters<EventName>
  ): RendererEventReturnType<EventName> {
    return ipcRenderer.invoke(
      channel,
      args
    ) as RendererEventReturnType<EventName>;
  },

  on<EventName extends MainEventNames>(
    channel: EventName,
    listener: MainEventListener<EventName>
  ) {
    ipcRenderer.on(channel, listener);
  },
});
