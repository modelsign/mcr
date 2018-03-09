const THREE = require('../../../../../../vender/three');
import em from '../../../../bus'

const FastClick = require('fastclick');

export default class LookControls {
    public scene: THREE.Scene;
    public camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    public enabled: boolean = true;
    public target: THREE.Vector3 = new THREE.Vector3();
    public cursor: THREE.Vector3;
    public hits: THREE.Intersection[];

    private domElement: Element;

    private startX: number;
    private endX: number;
    private startY: number;
    private endY: number;

    yawObject: THREE.Object3D;
    pitchObject: THREE.Object3D;

    constructor(scene, camera, domElement, cursor, hits) {
        FastClick.attach(document.body);

        this.scene = scene;
        this.camera = camera;
        this.domElement = domElement;

        this.camera.rotation.set(0, 0, 0);

        this.domElement.addEventListener('mousedown', this._onMouseDown, false);
        this.domElement.addEventListener('touchstart', this._onMouseDown, false);

    }

    _onMouseDown = this.onMouseDown.bind(this);
    _onMouseUp = this.onMouseUp.bind(this);
    _onTouchMove = this.onTouchMove.bind(this);
    _onMouseMove = this.onMouseMove.bind(this);


    dispose() {
        this.domElement.removeEventListener('mousedown', this._onMouseDown, false);
    }

    onMouseDown(event) {
        this.enabled = true;
        if (event instanceof MouseEvent) {
            this.domElement.addEventListener('mousemove', this._onMouseMove, false);
            this.domElement.addEventListener('mouseup', this._onMouseUp, false);
            this.startX = event.clientX;
            this.startY = event.clientY;
        } else if (event instanceof TouchEvent) {
            this.domElement.addEventListener('touchmove', this._onTouchMove, false);
            this.domElement.addEventListener('touchend', this._onMouseUp, false)
            console.log(event)
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
        }
    }

    onMouseUp(event) {
        this.enabled = false;
        this.domElement.removeEventListener('mousemove', this._onMouseMove, false);
        this.domElement.removeEventListener('mouseup', this._onMouseUp, false);
    }

    onTouchMove(event) {
        console.log(event);


        if (!this.enabled) return;

        let endX = this.endX = event.touches[0].clientX;
        let endY = this.endY = event.touches[0].clientY;


        let PI_2 = Math.PI / 2,
            {x: rotX, y: rotY, z: rotZ} = this.camera.rotation;

        rotY = (endX - this.startX) / this.domElement.clientWidth * Math.PI;
        // rotZ += movementY / this.domElement.clientHeight * Math.PI;
        rotZ = (this.domElement.clientHeight / 2 - endX) / this.domElement.clientHeight * Math.PI;

        // console.log({movementX: (endX - this.startX), movementY: (endY - this.startY), rotX, rotY, rotZ, event});
        em.emit(
            'event/log/trace',
            {step: '手指滑动', event}
        );

        this.camera.rotation.set(0, rotY, 0, 'XYZ');
        console.log({
            endX, endY
        })
    }

    onMouseMove(event) {
        if (!this.enabled) return;

        let endX = this.endX = event.clientX;
        let endY = this.endY = event.clientY;

        // let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        // let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        // let clientX = event.clientX || event.mozClientX || event.webkitClientX || 0;


        let PI_2 = Math.PI / 2,
            {x: rotX, y: rotY, z: rotZ} = this.camera.rotation;

        rotY = (endX - this.startX) / this.domElement.clientWidth * Math.PI;
        // rotZ += movementY / this.domElement.clientHeight * Math.PI;
        rotZ = (this.domElement.clientHeight / 2 - endX) / this.domElement.clientHeight * Math.PI;

        // console.log({movementX: (endX - this.startX), movementY: (endY - this.startY), rotX, rotY, rotZ, event});
        em.emit(
            'event/log/trace',
            {step: '鼠标拖动', event}
        );

        this.camera.rotation.set(0, rotY, 0, 'XYZ');
        // this.camera.rotateX(rotX);
    }


    getObject() {
        return this.yawObject;
    }

    getDirection() {
        let direction = new THREE.Vector3(0, 0, -1);
        let rotation = new THREE.Euler(0, 0, 0, "YXZ");

        return function (v) {
            rotation.set(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0);
            v.copy(direction).applyEuler(rotation);
            return v;
        };
    }
}

THREE.LookControls = LookControls;
