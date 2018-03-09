import {Space} from "./lib/Space";

declare let THREE: { GLTFLoader };
import '../../view/graph/js/loaders/GLTFLoader.js'
import {Objsrc} from "./lib/Objsrc";

export class MCloudLoader {

    _gltfLoader: any;

    /**
     * 数据服务根路径
     * //void.msign.net/v1/spaces/:sid
     */
    root: string;

    space: Space;
    srcMap: Objsrc[];


    constructor() {

        this._gltfLoader = new THREE.GLTFLoader();
    }


    start() {
    }

    stop() {
    }

    update() {

    }

}
