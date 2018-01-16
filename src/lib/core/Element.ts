import {Vector3} from "./Vector3";
import {IEvent} from "../interface/IEvent";
import {EventMap} from "typedoc/dist/lib/utils/events";


export class Element implements IEvent {

    addEventListener<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => any, useCapture?: boolean): void {

    }
}

export abstract class ElementConstructOption {

    isVisible: Boolean;
    isHitable: Boolean;
    isEditable: Boolean;
    isInternal: Boolean;

    id: String;
    position: Vector3;
}
