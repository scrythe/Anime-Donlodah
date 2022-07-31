import { IpcRendererEvent } from 'electron';

interface IpcRendererToMain {
  minimizeApp(): void;
  maximizeApp(): void;
  closeApp(): void;
  test(a: string): void;
}

interface IpcMainToRenderer {
  isMaximized(event: IpcRendererEvent): void;
  isRestored(event: IpcRendererEvent): void;
  test(event: IpcRendererEvent, a: string): void;
}

// type EventListType = 'toMain' | 'toRenderer';

interface EventsMap {
  [eventName: string]: any;
}

// type EventList<ListType extends EventListType> = ListType extends 'toMain'
//   ? IpcRendererToMain
//   : IpcMainToRenderer;

type EventNames<EventList extends EventsMap> = keyof EventList;

type EventParameters<
  EventList extends EventsMap,
  EventName extends EventNames<EventList>
> = Parameters<EventList[EventName]>;

type EventReturnType<
  EventList extends EventsMap,
  EventName extends EventNames<EventList>
> = ReturnType<EventList[EventName]>;

export type EventListenerArgs<
  EventList extends EventsMap,
  EventName extends EventNames<EventList>
> = EventParameters<EventList, EventName> extends []
  ? never
  : EventParameters<EventList, EventName>;

// type TotalEventArgs<
//   EventList extends EventsMap,
//   EventName extends EventNames<EventList>,
//   EventParameter extends Event
// > = EventListenerArgs<EventList, EventName> extends never
//   ? [event: EventParameter]
//   : [event: EventParameter, ...args: EventListenerArgs<EventList, EventName>];

// type EventListener<
//   EventList extends EventsMap,
//   EventName extends EventNames<EventList>,
//   EventParameter extends Event
// > = EventListenerArgs<EventList, EventName> extends never
//   ? (event: EventParameter) => EventReturnType<EventList, EventName>
//   : (
//       event: EventParameter,
//       ...args: EventListenerArgs<EventList, EventName>
//     ) => EventReturnType<EventList, EventName>;

type EventListener<
  EventList extends EventsMap,
  EventName extends EventNames<EventList>
> = EventList[EventName];

export type toMainEventNames = EventNames<IpcRendererToMain>;

export type toMainEventParameters<EventName extends toMainEventNames> =
  EventParameters<IpcRendererToMain, EventName>;

export type returnTypeBackToRenderer<EventName extends toMainEventNames> =
  Promise<EventReturnType<IpcRendererToMain, EventName>>;

export type toMainEventListener<EventName extends toMainEventNames> =
  EventListener<IpcRendererToMain, EventName>;

// -- --

export type toRendererEventNames = keyof IpcMainToRenderer;

export type toRendererEventParameters<EventName extends toRendererEventNames> =
  Parameters<IpcMainToRenderer[EventName]>;

export type toRendererEventListener<EventName extends toRendererEventNames> =
  IpcMainToRenderer[EventName];

// type test<EventName extends toMainEventNames> = EventListener<
//   IpcRendererToMain,
//   EventName,
//   Event
// >;
