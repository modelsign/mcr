import {ModelElement} from "./ModelElement";
import {Vector3} from "../Core/Vector3";

export class ModelGltfElementConstructOption {
    urlGltf: string;
    position: Vector3;
    scale: number;
}


export class ModelObjElement extends ModelElement {

    urlGltf: string;

    constructor(option: ModelGltfElementConstructOption) {
        super();

        this.position = option.position;
        this.urlGltf = option.urlGltf;
    }
}
