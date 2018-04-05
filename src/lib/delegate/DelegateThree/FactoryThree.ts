import * as THREE from "three";
import MouseControls from "./Controls/MouseControl";
import CameraManager from "./Managers/CameraManager";
import {Vector3} from "three";

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
        const GROUND_WIDTH = 10000;
        let camera = new THREE.PerspectiveCamera(
            30, 1, 1,
            Math.min(GROUND_WIDTH * 10, 100000));
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

    static async createElementGround(scene: THREE.Scene) {
        let planeGeometry = new THREE.PlaneGeometry(2000, 2000);
        planeGeometry.rotateX(-Math.PI / 2);
        let planeMaterial = new THREE.ShadowMaterial({opacity: 0.2});
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = -200;
        plane.receiveShadow = true;

        let helper = new THREE.GridHelper(2000, 100);
        helper.position.y = -199;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;

        scene.add(helper);
        scene.add(plane);
    }


    static async createManagerCamera(camera: THREE.PerspectiveCamera) {
        return new CameraManager(camera)
    }
}

