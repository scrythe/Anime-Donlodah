interface IpcEvents {
  yeet(): void;
  lol(): string;
}

export type EventNames = keyof IpcEvents;

export type EventListener<Event extends EventNames> = IpcEvents[Event];

export type EventParameters<Event extends EventNames> = Parameters<
  EventListener<Event>
>;

export type EventReturnType<Event extends EventNames> = ReturnType<
  EventListener<Event>
>;
