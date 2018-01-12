import {Vector3} from "./Vector3";

export abstract class Element {
    // abstract createDefaultConstructOption();
}

export abstract class ElementConstructOption {

    isVisible: Boolean;
    isHitable: Boolean;
    isEditable: Boolean;
    isInternal: Boolean;

    id: String;
    position: Vector3;
}
