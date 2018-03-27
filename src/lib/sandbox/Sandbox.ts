import {LineElement} from "./elements/LineElement";
import {FaceElement} from "./elements/FaceElement";
import {ModelElement} from "./elements/ModelElement";
import Layer from "../core/Layer/Layer";

import {List} from 'immutable'

export class Sandbox {
    _lines: List<LineElement> = List();
    _faces: List<FaceElement> = List();
    _models: List<ModelElement> = List();
    _layers: List<Layer> = List();

    _linesHistory: List<LineElement[]>;
    _facesHistory: List<FaceElement[]>;
    _modelsHistory: List<ModelElement[]>;
    _layersHistory: List<Layer[]>;

    isGroundVisible: boolean = true;
    isHelperVisible: boolean = true;

    constructor() {
    }


    public get lines() {
        return this._lines;
    }

    public get faces() {
        return this._faces;
    }

    public get models() {
        return this._models;
    }

    public get layer() {
        return this._layers;
    }

    public static createLine(): LineElement {

        return new LineElement();
    }

    public static createFace(): FaceElement {

        return null;
    }

    public static createModel(): ModelElement {

        return null;
    }


}

export default new Sandbox();
