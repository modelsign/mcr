import {Element} from "../Core/Element";
import {Vector3} from "../Core/Vector3";

export abstract class ModelElement extends Element {


    isVisible: boolean;
    isHitable: boolean;

    type: string;
    position: Vector3;

    constructor() {
        super();
    }
}
