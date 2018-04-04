import * as THREE from 'three'

export default class DelegateThree {

    private scene: THREE.Scene;
    private container: Element;
    private camera: THREE.Camera;
    private renderer: THREE.Renderer;

    async create(container) {
        const GROUND_WIDTH = 10000;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 1, Math.min(GROUND_WIDTH * 10, 100000));
        const renderer = new THREE.WebGLRenderer(
            {
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true
            }
        );

        this.container = container;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.renderSingleSided = false;
        renderer.shadowMap.enabled = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.sortObjects = true;

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.localClippingEnabled = true;


        container.innerHTML = '';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        container.appendChild(renderer.domElement);

        return container
    }

    async render(time) {


    }
}
