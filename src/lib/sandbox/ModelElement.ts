import {Element} from "../core/Element";
import {Vector3} from "../core/Vector3";

export abstract class ModelElement extends Element {


    isVisible: boolean;
    isHitable: boolean;

    type: string;
    position: Vector3;

    constructor() {
        super();
    }
}
