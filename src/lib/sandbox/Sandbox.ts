import {LineElement} from "./LineElement";
import {FaceElement} from "./FaceElement";
import {ModelElement} from "./ModelElement";
import Layer from "../core/Layer/Layer";

import {List} from 'immutable'

export class Sandbox {
    lines: LineElement[] = [];
    faces: FaceElement[] = [];
    models: ModelElement[] = [];
    layers: Layer[] = [];

    linesHistory: List<LineElement[]>;
    facesHistory: List<FaceElement[]>;
    modelsHistory: List<ModelElement[]>;
    layersHistory: List<Layer[]>;

    isGroundVisible: boolean = true;
    isHelperVisible: boolean = true;

    constructor() {
    }
}

export default new Sandbox();
