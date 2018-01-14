import {Element} from "../core/Element";

class SceneControllerOption {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    controls: THREE.OrbitControls;
}

/**
 * 注意, 这个事件定义是针对场景内元素的.
 * 而非场景渲染器的容器
 */
enum SceneEventEnum {
    click = 'scene/element/click',
    doubleclick = 'scene/element/doubleclick',
    emptyclick = 'scene/element/emptyclick',
    mousemove = 'scene/element/mousemove',
    mouseover = 'scene/element/mouseover',
    mouseout = 'scene/element/mouseout',
}

export class SceneController {

    scene: THREE.Scene;

    constructor(option: SceneControllerOption) {

    }
}
