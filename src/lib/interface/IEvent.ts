import {EventMap} from "typedoc/dist/lib/utils/events";

export interface IEvent {
    addEventListener<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => any, useCapture?: boolean): void;
}
