import { ipcRenderer, contextBridge } from 'electron';
import { EventNames, EventParameters, EventReturnType } from './ipcInterface';

contextBridge.exposeInMainWorld('api', {
  send<EventName extends EventNames>(
    channel: EventName,
    ...args: EventParameters<EventName>
  ) {
    ipcRenderer.send(channel, args);
  },

  invoke<EventName extends EventNames>(
    channel: EventName,
    ...args: EventParameters<EventName>
  ): Promise<EventReturnType<EventName>> {
    return ipcRenderer.invoke(channel, args) as Promise<
      EventReturnType<EventName>
    >;
  },
});
