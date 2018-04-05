import * as THREE from 'three'
import FactoryThree from './DelegateThree/FactoryThree'
import {EventDispatcher} from "three";
import Control from "./DelegateThree/Controls/Control";

export default class DelegateThree extends EventDispatcher {

    private scene: THREE.Scene;
    private container: Element;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.Renderer;
    private mouseControl: Control;

    public getControl() {
        return this.mouseControl;
    }

    async create(container) {

        const scene = await FactoryThree.createThreeScene();
        const camera = await FactoryThree.createThreeCamera();
        const renderer = await FactoryThree.createThreeRender();
        const mouseControl = await FactoryThree.createThreeMouseControl(
            scene, camera,
            renderer.domElement,
            new THREE.Vector3(0, 0, 0), []
        );

        this.container = container;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.mouseControl = mouseControl;

        container.innerHTML = '';
        await container.appendChild(renderer.domElement);
        await FactoryThree.createElementGround(scene);

        await this.renderResize();
        return container
    }

    async render(time) {
        this.renderer.render(this.scene, this.camera);
        this.getControl().update(time);
    }

    private async renderResize() {
        let renderer = this.renderer,
            container = this.container,
            camera = this.camera;
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    }
}
