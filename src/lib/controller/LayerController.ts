import {Vue} from "vue/types/vue";
import Layer from "../core/Layer/Layer";


import AutoLayer from '../core/Layer/AutoLayer'


export default class LayerController {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;

    layers: Layer[];

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.scene = scene;
        this.camera = camera;


    }
}
