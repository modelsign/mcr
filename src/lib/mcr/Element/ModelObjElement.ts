import {ModelElement} from "./ModelElement";

export class ModelObjElementConstructOption {
    urlObj: string;
    urlMtl: string;
}

export class ModelObjElement extends ModelElement {
    urlObj: string;
    urlMtl: string;

    constructor(option: ModelObjElementConstructOption) {
        super();
        this.urlMtl = option.urlMtl;
        this.urlObj = option.urlObj;
    }
}
