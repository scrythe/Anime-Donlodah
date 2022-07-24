export interface IpcRendererToMain {
  minimizeApp(): void;
  maximizeApp(): void;
  closeApp(): void;
}

export interface IpcMainToRenderer {
  isMaximized(): void;
  isRestored(): void;
}

interface EventsMap {
  [event: string]: any;
}

type EventNames<EventList extends EventsMap> = keyof EventList;

type EventListener<
  EventList extends EventsMap,
  Event extends EventNames<EventList>
> = EventList[Event];

type EventParameters<
  EventList extends EventsMap,
  Event extends EventNames<EventList>
> = Parameters<EventListener<EventList, Event>>;

type EventReturnType<
  EventList extends EventsMap,
  Event extends EventNames<EventList>
> = ReturnType<EventListener<EventList, Event>>;

// -- --

export type RendererEventNames = EventNames<IpcRendererToMain>;

export type RendererEventListener<Event extends EventNames<IpcRendererToMain>> =
  IpcRendererToMain[Event];

export type RendererEventParameters<
  Event extends EventNames<IpcRendererToMain>
> = EventParameters<IpcRendererToMain, Event>;

export type RendererEventReturnType<
  Event extends EventNames<IpcRendererToMain>
> = Promise<EventReturnType<IpcRendererToMain, Event>>;

// -- --

export type MainEventNames = EventNames<IpcMainToRenderer>;

export type MainEventListener<Event extends EventNames<IpcMainToRenderer>> =
  IpcMainToRenderer[Event];

export type MainEventParameters<Event extends EventNames<IpcMainToRenderer>> =
  EventParameters<IpcMainToRenderer, Event>;
