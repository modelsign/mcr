import instEventEmiter from "../../bus";

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

/**
 * 场景控制器
 * 这个类应该实现一些场景内部的资源管理.
 *
 * 需要管理的资源
 * 1. 场景实例
 * 2. 相机实例
 * 3. 渲染器实例
 * 4. 鼠标交互控制器实例(OrbitControl)
 *
 *
 */
export class SceneController {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    controls: THREE.OrbitControls;
    elements: Element;

    static instance = null;

    static getInstance() {
        if (SceneController.instance === null) {
            return null;
        }
        return SceneController.instance;
    }

    static createInstance({scene, camera, renderer, controls}) {
        if (SceneController.instance === null) {
            SceneController.instance = new SceneController({scene, camera, renderer, controls});
        }
        return SceneController.instance;
    }

    private constructor({scene, camera, renderer, controls}) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
    }
}
