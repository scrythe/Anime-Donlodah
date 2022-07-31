import { Event as EventType } from 'electron';

export interface IpcRendererToMain {
  minimizeApp(): void;
  maximizeApp(): void;
  closeApp(): void;
  test(a: string): void;
}

export interface IpcMainToRenderer {
  isMaximized(): void;
  isRestored(): void;
  test(a: string): void;
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

type IpcEventListener<
  EventList extends EventsMap,
  Event extends EventNames<EventList>
> = (
  event: EventType,
  ...args: EventParameters<EventList, Event>
) => ReturnType<EventListener<EventList, Event>>;

// -- --

export type RendererEventNames = EventNames<IpcRendererToMain>;

export type RendererEventListener<Event extends EventNames<IpcRendererToMain>> =
  IpcEventListener<IpcRendererToMain, Event>;

export type RendererEventParameters<
  Event extends EventNames<IpcRendererToMain>
> = EventParameters<IpcRendererToMain, Event>;

export type RendererEventReturnType<
  Event extends EventNames<IpcRendererToMain>
> = Promise<EventReturnType<IpcRendererToMain, Event>>;

// -- --

export type MainEventNames = EventNames<IpcMainToRenderer>;

export type MainEventListener<Event extends EventNames<IpcMainToRenderer>> =
  IpcEventListener<IpcMainToRenderer, Event>;

export type MainEventParameters<Event extends EventNames<IpcMainToRenderer>> =
  EventParameters<IpcMainToRenderer, Event>;

function test<EventName extends MainEventNames>(
  event: EventName,
  a: Parameters<IpcMainToRenderer[EventName]>
) {
  a[0] == '';
}
