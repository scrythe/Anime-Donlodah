import { IpcMainEvent, IpcMainInvokeEvent, IpcRendererEvent } from 'electron';

interface IpcRendererToMainSend {
  minimizeApp(event: IpcMainEvent): void;
  maximizeApp(event: IpcMainEvent): void;
  closeApp(event: IpcMainEvent): void;
  test(event: IpcMainEvent, a: string, b: string): void;
}

interface IpcRendererToMainInvoke {
  minimizeApp(event: IpcMainInvokeEvent): void;
  maximizeApp(event: IpcMainInvokeEvent): void;
  closeApp(event: IpcMainInvokeEvent): void;
  test(event: IpcMainInvokeEvent, a: string): void;
}

interface IpcMainToRenderer {
  isMaximized(event: IpcRendererEvent): void;
  isRestored(event: IpcRendererEvent): void;
  test(event: IpcRendererEvent, a: string): void;
}

interface EventsMap {
  [eventName: string]: any;
}

type EventNames<EventList extends EventsMap> = keyof EventList;

type EventListener<
  EventList extends EventsMap,
  EventName extends EventNames<EventList>
> = EventList[EventName];

type EventParameters<
  EventList extends EventsMap,
  EventName extends EventNames<EventList>
  // remove event from Args
> = EventList[EventName] extends (event: any, ...args: infer Args) => any
  ? Args
  : never;

type EventReturnType<
  EventList extends EventsMap,
  EventName extends EventNames<EventList>
> = ReturnType<EventList[EventName]>;

// -- --

export type toMainEventNamesSend = EventNames<IpcRendererToMainSend>;

export type toMainEventParametersSend<EventName extends toMainEventNamesSend> =
  EventParameters<IpcRendererToMainSend, EventName>;

export type toMainEventListenerSend<EventName extends toMainEventNamesSend> =
  EventListener<IpcRendererToMainSend, EventName>;

// -- --

export type toMainEventNamesInvoke = EventNames<IpcRendererToMainInvoke>;

export type toMainEventParametersInvoke<
  EventName extends toMainEventNamesInvoke
> = EventParameters<IpcRendererToMainInvoke, EventName>;

export type returnTypeBackToRendererInvoke<
  EventName extends toMainEventNamesInvoke
> = Promise<EventReturnType<IpcRendererToMainInvoke, EventName>>;

export type toMainEventListenerInvoke<
  EventName extends toMainEventNamesInvoke
> = EventListener<IpcRendererToMainInvoke, EventName>;

// -- --

export type toRendererEventNames = EventNames<IpcMainToRenderer>;

export type toRendererEventListener<EventName extends toRendererEventNames> =
  EventListener<IpcMainToRenderer, EventName>;

export type toRendererEventParameters<EventName extends toRendererEventNames> =
  EventParameters<IpcMainToRenderer, EventName>;
