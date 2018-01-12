import {LineElement} from "../../lib/mcr/Element/LineElement";
import {FaceElement} from "../../lib/mcr/Element/FaceElement";
import {ModelElement} from "../../lib/mcr/Element/ModelElement";

class MCRSandbox {
    lines: LineElement[] = [];
    faces: FaceElement[] = [];
    models: ModelElement[] = [];

    isGroundVisible: boolean = true;
    isHelperVisible: boolean = false;

    constructor() {
    }
}

export default new MCRSandbox();
