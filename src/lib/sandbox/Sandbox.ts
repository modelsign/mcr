import {LineElement} from "./LineElement";
import {FaceElement} from "./FaceElement";
import {ModelElement} from "./ModelElement";

export class Sandbox {
    lines: LineElement[] = [];
    faces: FaceElement[] = [];
    models: ModelElement[] = [];

    isGroundVisible: boolean = true;
    isHelperVisible: boolean = true;

    constructor() {
    }
}

export default new Sandbox();
