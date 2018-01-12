import {LineElement} from "./LineElement";
import {FaceElement} from "./FaceElement";
import {ModelElement} from "./ModelElement";

class MCRSandbox {
    lines: LineElement[] = [];
    faces: FaceElement[] = [];
    models: ModelElement[] = [];

    isGroundVisible: boolean = true;
    isHelperVisible: boolean = true;

    constructor() {
    }
}

export default new MCRSandbox();
