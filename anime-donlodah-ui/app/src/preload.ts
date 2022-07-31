import { ipcRenderer, contextBridge } from 'electron';
import {
  toMainEventNamesSend,
  toMainEventNamesInvoke,
  toMainEventParametersSend,
  toMainEventParametersInvoke,
  returnTypeBackToRendererInvoke,
  toRendererEventNames,
  toRendererEventListener,
} from '../../globalInterfaces/ipcInterface';

contextBridge.exposeInMainWorld('api', {
  send<EventName extends toMainEventNamesSend>(
    channel: EventName,
    ...args: toMainEventParametersSend<EventName>
  ) {
    ipcRenderer.send(channel, args);
  },

  invoke<EventName extends toMainEventNamesInvoke>(
    channel: EventName,
    ...args: toMainEventParametersInvoke<EventName>
  ): returnTypeBackToRendererInvoke<EventName> {
    return ipcRenderer.invoke(
      channel,
      args
    ) as returnTypeBackToRendererInvoke<EventName>;
  },

  on<EventName extends toRendererEventNames>(
    channel: EventName,
    listener: toRendererEventListener<EventName>
  ) {
    channel;
    listener;
    ipcRenderer.on(channel, listener);
  },
});
