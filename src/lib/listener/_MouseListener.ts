import MouseControls from "../view/graph/js/controls/MouseControls";

export class _MouseListener {
    scene: THREE.Scene;
    mouse: MouseControls;

    constructor(scene: THREE.Scene, mouse: MouseControls) {
        this.scene = scene;
        this.mouse = mouse;


        scene.addEventListener('mousedown', this.onMousedown.bind(this));
    }
    
    private onMousedown(event) {
        console.log(event);
    }
}
