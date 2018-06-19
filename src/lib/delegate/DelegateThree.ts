import * as THREE from 'three'
import FactoryThree from './DelegateThree/FactoryThree'
import {EventDispatcher} from "three";
import Control from "./DelegateThree/Controls/Control";

import * as ThreeConStats from './DelegateThree/Controllers/Stats/stats.min.js'

const IS_CON_VISIBLE = true;

export default class DelegateThree extends EventDispatcher {

    private scene: THREE.Scene;
    private container: Element;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.Renderer;
    private mouseControl: Control;


    private _conStats: any;
    private _isConStateVisible = false;

    constructor() {
        super();
    }

    public get isConStateVisible() {
        return this._isConStateVisible;
    }

    public set isConStateVisible(value) {
        this._isConStateVisible = value;

        if (value) {
            this._conStats.dom.style.visibility = '';
        } else {
            this._conStats.dom.style.visibility = 'hidden';
        }
    }

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


        // 初始化并添加stats控件
        this._conStats = new ThreeConStats();
        this.isConStateVisible = IS_CON_VISIBLE;
        container.appendChild(this._conStats.dom);

        return container
    }

    async unrender() {
        if (this._isConStateVisible) this._conStats.begin();
        if (this._isConStateVisible) this._conStats.end();
    }

    async render(time) {
        if (this._isConStateVisible) this._conStats.begin();
        this.renderer.render(this.scene, this.camera);
        this.getControl().update(time);
        if (this._isConStateVisible) this._conStats.end();
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
