export enum EventRequestCameraActionEnum {
    move
}

export class EventRequestCameraActionMoveArg {
    position: THREE.Vector3;
    direction: THREE.Vector3;
    timeout: number
}

export class EventRequestCamera {
    action: EventRequestCameraActionEnum;
    arg: EventRequestCameraActionMoveArg;

    constructor(action: EventRequestCameraActionEnum, arg: EventRequestCameraActionMoveArg) {

    }
}
