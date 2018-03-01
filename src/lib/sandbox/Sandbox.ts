import {LineElement} from "./LineElement";
import {FaceElement} from "./FaceElement";
import {ModelElement} from "./ModelElement";
import Layer from "../core/Layer/Layer";

export class Sandbox {
    lines: LineElement[] = [];
    faces: FaceElement[] = [];
    models: ModelElement[] = [];

    layers: Layer[] = [];

    isGroundVisible: boolean = true;
    isHelperVisible: boolean = true;

    constructor() {
    }
}

export default new Sandbox();
