import * as THREE from "three";
import MouseControls from "./Controls/MouseControl";
import CameraManager from "./Managers/CameraManager";
import {Vector3} from "three";

const CONST_GROUND_SIZE = 10000,
    CONST_GROUND_DIVISIONS = 100,
    CONST_GROUND_ELEVATION = 0,
    CONST_GROUND_OPACITY = 0.75;

export default class FactoryThree {

    static async createThreePoint(x, y, z) {
        return new Vector3(x, y, z);
    }

    static async createThreeRender() {
        const renderer = new THREE.WebGLRenderer(
            {
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true
            }
        );
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.renderSingleSided = false;
        renderer.shadowMap.enabled = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.sortObjects = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.localClippingEnabled = true;
        // renderer.domElement.style.width = '100%';
        // renderer.domElement.style.height = '100%';

        return renderer;
    }

    static async createThreeScene() {
        return new THREE.Scene();
    }

    static async createThreeCamera() {
        let camera = new THREE.PerspectiveCamera(
            30, 1, 1,
            Math.min(CONST_GROUND_SIZE * 10, 100000));
        camera.position.setX(1000);
        camera.position.setY(1000);
        camera.position.setZ(1000);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        return camera
    }

    static async createThreeMouseControl(scene: THREE.Scene,
                                         camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
                                         domElement: Element,
                                         cursor: THREE.Vector3,
                                         hits: THREE.Intersection[] = []) {

        return new MouseControls(scene, camera, domElement, cursor, hits);
    }

    /**
     * 创建地面元素
     * @param {Scene} scene
     * @return {Promise<void>}
     */
    static async createElementGround(scene: THREE.Scene) {
        let planeGeometry = new THREE.PlaneGeometry(CONST_GROUND_SIZE, CONST_GROUND_SIZE);
        planeGeometry.rotateX(-Math.PI / 2);
        let planeMaterial = new THREE.ShadowMaterial({opacity: 0.2});
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = CONST_GROUND_ELEVATION;
        plane.receiveShadow = true;

        let helper = new THREE.GridHelper(CONST_GROUND_SIZE, CONST_GROUND_DIVISIONS);
        helper.position.y = CONST_GROUND_ELEVATION;
        helper.material.opacity = CONST_GROUND_OPACITY;
        helper.material.transparent = true;

        scene.add(helper);
        scene.add(plane);
    }

    /**
     * 创建文字标记元素
     * @param {string} text
     * @return {Promise<void>}
     */
    static async createElementText(text: string) {

    }

    /**
     * 创建相机管理器
     * @param {PerspectiveCamera} camera
     * @return {Promise<CameraManager>}
     */
    static async createManagerCamera(camera: THREE.PerspectiveCamera) {
        return new CameraManager(camera)
    }
}

