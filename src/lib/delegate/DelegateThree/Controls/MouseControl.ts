const THREE = require('three');
import {debounce, throttle, bind} from 'lodash'
import Control from "./Control";
import {Tween, Easing} from '@tweenjs/tween.js';
import {start} from "repl";
import {EventDispatcher, Object3D, Quaternion, Vector2} from "three";

enum STATE {
    NONE = -1,
    ROTATE = 0,
    DOLLY = 1,
    PAN = 2,
    TOUCH_ROTATE = 3,
    TOUCH_DOLLY = 4,
    TOUCH_PAN = 5
}

const changeEvent = {type: 'change'},
    startEvent = {type: 'start'},
    endEvent = {type: 'end'};

const TIME_QUICK_MOMENT = 100;

export default class MouseControls extends Control {
    public camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;

    public enable: boolean = true;
    public target: THREE.Vector3 = new THREE.Vector3();
    public cursor: THREE.Vector3;
    public hits: THREE.Intersection[];

    // 移动时候允许相机和目标点的最大最小距离;
    // 对于圆锥投影类型的相机有效
    public minDistance: number = 0;
    public maxDistance: number = Infinity;

    // 缩放时候允许相机和目标点的最大最小距离;
    // 对于正投影类型的相机有效
    public minZoom: number = 0;
    public maxZoom: number = Infinity;

    // polar angle, 极角. 指的是竖直方向相机能绕目标点旋转的角度范围. 单位为弧度
    public minPolarAngle: number = 0;
    public maxPolarAngle: number = Math.PI;

    // 相机在水平方向的绕行弧度范围. 单位为弧度.
    // 可不限制, 如果设置实数, 则需要满足区间限制. [-Math.PI, Math.PI]
    public minAzimuthAngle: number = -Infinity;
    public maxAzimuthAngle: number = Infinity;

    // 防止抖动. 开启后需要手动调用 controls.update()函数以更新.
    public enableDamping: boolean = false;
    public dampingFactor: number = 0.5;

    public enableZoom: boolean = true;
    public zoomSpeed: number = 1.0;

    public enableRotate: boolean = true;
    public rotateSpeed: number = 1.0;

    public enablePan: boolean = true;
    public keyPanSpeed: number = 1.0;

    public autoRotate: boolean = false;
    public autoRotateSpeed = 1.0;

    public enableKeys: boolean = true;
    public keys: { LEFT: number, UP: number, RIGHT: number, BOTTOM: number } = {
        LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40
    };

    public mouseBottons: { ORBIT: THREE.MOUSE, ZOOM: THREE.MOUSE, PAN: THREE.MOUSE } = {
        ORBIT: THREE.MOUSE.LEFT,
        ZOOM: THREE.MOUSE.MIDDLE,
        PAN: THREE.MOUSE.RIGHT,
    };

    private target0: THREE.Vector3;
    private postition0: THREE.Vector3;
    private zoom0: number;

    // 当前的控制状态
    private state: STATE = STATE.NONE;

    private EPS = 0.000001;


    // 用于存放相机的控制球面坐标系
    private spherical: THREE.Spherical = new THREE.Spherical();
    // 相机变化时候的更新量
    private sphericalDelta: THREE.Spherical = new THREE.Spherical();

    private scale: number = 1;
    private panOffset: THREE.Vector3 = new THREE.Vector3();
    private zoomChanged: boolean = false;

    private rotateStart: THREE.Vector2 = new THREE.Vector2();
    private rotateEnd: THREE.Vector2 = new THREE.Vector2();
    private rotateDelta: THREE.Vector2 = new THREE.Vector2();

    private panStart: THREE.Vector2 = new THREE.Vector2();
    private panEnd: THREE.Vector2 = new THREE.Vector2();
    private panDelta: THREE.Vector2 = new THREE.Vector2();

    private dollyStart: THREE.Vector2 = new THREE.Vector2();
    private dollyEnd: THREE.Vector2 = new THREE.Vector2();
    private dollyDelta: THREE.Vector2 = new THREE.Vector2();


    private domElement: Element;

    private scene: THREE.Scene;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private tCursor: Tween;
    private isRaying: boolean = false;
    private timestampIntersect: number = 0;

    constructor(scene: THREE.Scene,
                camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
                domElement: Element,
                cursor: THREE.Vector3,
                hits: THREE.Intersection[] = []) {
        super();

        this.scene = scene;
        this.camera = camera;
        this.domElement = domElement;
        this.cursor = cursor;
        this.hits = hits;
        // console.log(cursor)
        this.target0 = this.target.clone();
        this.postition0 = this.camera.position.clone();
        this.zoom0 = this.camera.zoom;

        domElement.addEventListener('contextmenu', this._onContextMenu, false);

        domElement.addEventListener('dblclick', this._onDblclick, false);
        domElement.addEventListener('mousedown', this._onMouseDown, false);
        // 这个设计挺智障的. 因为另一个控制器(DragControls)也用到了mousemove, 它在里边通过终止冒泡来取消外部拖拽.
        document.addEventListener('mousemove', this._onMouseMove, false);
        domElement.addEventListener('wheel', this._onMouseWheel, false);
        domElement.addEventListener('touchstart', this._onTouchStart, false);
        domElement.addEventListener('touchend', this._onTouchEnd, false);
        domElement.addEventListener('touchmove', this._onTouchMove, false);
        window.addEventListener('keydown', this._onKeyDown, false);

        this.update();
    }

    /**
     * 获取当前相机所在位置的极角
     * @return {number}
     */
    public getPolarAngle(): number {
        return this.spherical.phi;
    }

    public getAzimuthalAngle(): number {
        return this.spherical.theta;
    }

    public reset(): MouseControls {
        this.target.copy(this.target0);
        this.camera.position.copy(this.postition0);
        this.camera.zoom = this.zoom0;

        this.camera.updateProjectionMatrix();
        this.dispatchEvent(changeEvent);

        this.update();
        this.state = STATE.NONE;

        return this;
    }

    public update(): MouseControls {
        let camera = this.camera,
            cameraPosition = this.camera.position,
            target = this.target,
            panOffset = this.panOffset,
            spherical = this.spherical,
            sphericalDelta = this.sphericalDelta;


        // 这个offset指的是相机位置从观察点(target)的偏移量.
        let offset: THREE.Vector3 = new THREE.Vector3();

        // 计算出当前相机up方向转变成正上方所需的四元素
        // 这个四元素本质上是描述的相机俯角.
        let quat = new THREE.Quaternion()
                .setFromUnitVectors(
                    camera.up, new THREE.Vector3(0, 1, 0)
                ),
            quatInverse = quat.clone().inverse();

        let lastPosition = new THREE.Vector3();
        let lastQuaternion: Quaternion = new THREE.Quaternion();

        offset.copy(cameraPosition).sub(this.target);
        offset.applyQuaternion(quat);

        // 先将相机当前的姿态装入预先准备好的球面坐标系. 以开始姿态控制
        spherical.setFromVector3(offset);

        if (this.autoRotate && this.state === STATE.NONE) {

        }

        /** ************************************************
         *                    自旋过程
         *
         *  自旋仅控制相机自身的姿态, 与目标点无关. 本质上是四元素.
         ***************************************************/

        spherical.theta += sphericalDelta.theta;
        spherical.phi += sphericalDelta.phi;

        spherical.theta = Math.max(this.minAzimuthAngle, spherical.theta);
        spherical.theta = Math.min(this.maxAzimuthAngle, spherical.theta);
        spherical.phi = Math.max(this.minPolarAngle, spherical.phi);
        spherical.phi = Math.min(this.maxPolarAngle, spherical.phi);

        //guess 保证相机不绝对朝上和朝下, 可能是未来防止零除错误
        spherical.makeSafe();

        spherical.radius *= this.scale;

        spherical.radius = Math.max(this.minDistance, spherical.radius);
        spherical.radius = Math.min(this.maxDistance, spherical.radius);

        /** ************************************************
         *                     平移过程
         *
         *  平移仅控制相机的位置, 与姿态无关.
         ***************************************************/
        target.add(panOffset);

        offset.setFromSpherical(spherical);
        offset.applyQuaternion(quatInverse);

        cameraPosition.copy(target).add(offset);
        camera.lookAt(target);

        // 如果开启平滑功能, theta和phi则按预设的衰减因子衰减
        // 这也是为什么需要在外部主动调用 .update()函数的原因
        if (this.enableDamping) {
            sphericalDelta.phi = sphericalDelta.phi * (1 - this.dampingFactor);
            sphericalDelta.theta = sphericalDelta.theta * (1 - this.dampingFactor);
        } else {
            sphericalDelta.set(0, 0, 0);
        }

        // 移动完毕后, 重置当前状态.
        // 缩放比例置为1, 拖动便宜量置为 0,0,0
        this.scale = 1;
        panOffset.set(0, 0, 0);

        // 不知所谓
        if (
            this.zoomChanged ||
            lastPosition.distanceToSquared(cameraPosition) > this.EPS ||
            (8 * lastQuaternion.dot(camera.quaternion) > this.EPS)
        ) {
            this.dispatchEvent(changeEvent);
            lastPosition.copy(cameraPosition);
            lastQuaternion.copy(camera.quaternion);
            this.zoomChanged = false;
        }
        return this;
    }

    public dispose() {
        this.domElement.removeEventListener('contextmenu', this._onContextMenu, false);
        this.domElement.removeEventListener('mousedown', this._onMouseDown, false);
        this.domElement.removeEventListener('wheel', this._onMouseWheel, false);

        this.domElement.removeEventListener('touchstart', this._onTouchStart, false);
        this.domElement.removeEventListener('touchend', this._onTouchEnd, false);
        this.domElement.removeEventListener('touchmove', this._onTouchMove, false);

        document.removeEventListener('mousemove', this._onMouseMove, false);
        this.domElement.removeEventListener('mouseup', this._onMouseUp, false);

        window.removeEventListener('keydown', this._onKeyDown, false);
    }


    private getAutoRotationAngle(): number {
        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
    }

    private getZoomScale(): number {
        return Math.pow(0.95, this.zoomSpeed);
    }

    private rotateLeft(angle: number): MouseControls {
        this.sphericalDelta.theta -= angle;
        return this;
    }

    private rotateUp(angle: number): MouseControls {
        this.sphericalDelta.phi -= angle;
        return this;
    }

    private panLeft(distance, objectMatrix): MouseControls {
        let v = new THREE.Vector3();
        v.setFromMatrixColumn(objectMatrix, 0);
        v.multiplyScalar(-distance);
        this.panOffset.add(v);
        return this;
    }

    private panUp(distance, objectMatrix): MouseControls {
        let v = new THREE.Vector3();
        v.setFromMatrixColumn(objectMatrix, 1);
        v.multiplyScalar(distance);
        this.panOffset.add(v);
        return this;
    }

    /**
     * 镜头平移
     * @param {number} deltaX
     * @param {number} deltaY
     * @return {MouseControls}
     */
    private pan(deltaX: number, deltaY: number): MouseControls {
        let camera = this.camera;

        let offset: THREE.Vector3 = new THREE.Vector3();

        let element = this.domElement;

        /** **********************
         *      区分相机类型
         *************************/
        if (camera instanceof THREE.PerspectiveCamera) {
            // perspective
            let cameraP: THREE.PerspectiveCamera = <THREE.PerspectiveCamera>camera;
            let position = cameraP.position;
            offset.copy(position).sub(this.target);
            let targetDistance = offset.length();

            // half of the fov is center to top of screen
            targetDistance *= Math.tan((cameraP.fov / 2) * Math.PI / 180.0);

            // we actually don't use screenWidth, since perspective camera is fixed
            // to screen height
            this.panLeft(
                2 * deltaX * targetDistance / element.clientHeight,
                cameraP.matrix
            );
            this.panUp(
                2 * deltaY * targetDistance / element.clientHeight,
                cameraP.matrix
            );
        } else if (camera instanceof THREE.OrthographicCamera) {
            // orthographic
            let cameraO: THREE.OrthographicCamera = <THREE.OrthographicCamera>camera;
            this.panLeft(
                deltaX
                * (cameraO.right - cameraO.left)
                / cameraO.zoom / element.clientWidth,
                cameraO.matrix
            );
            this.panUp(deltaY * (cameraO.top - cameraO.bottom) / cameraO.zoom / element.clientHeight, cameraO.matrix);
        } else {
            this.enablePan = false;
        }
        return this;
    }

    /**
     * 镜头拉近
     * @param dollyScale
     * @return {MouseControls}
     */
    private dollyIn(dollyScale): MouseControls {
        let camera = this.camera;
        if (camera instanceof THREE.PerspectiveCamera) {
            this.scale /= dollyScale;
        } else if (camera instanceof THREE.OrthographicCamera) {
            camera.zoom *= dollyScale;
            camera.zoom = Math.max(this.minZoom, camera.zoom);
            camera.zoom = Math.min(this.maxZoom, camera.zoom);
            camera.updateProjectionMatrix();
            this.zoomChanged = true;
        } else {
            this.enableZoom = false;
        }
        return this;
    }

    /**
     * 镜头拉远
     * @param dollyScale
     * @return {MouseControls}
     */
    private dollyOut(dollyScale): MouseControls {
        let camera = this.camera;
        if (camera instanceof THREE.PerspectiveCamera) {
            this.scale *= dollyScale;
        } else if (camera instanceof THREE.OrthographicCamera) {
            camera.zoom /= dollyScale;
            camera.zoom = Math.max(this.minZoom, camera.zoom);
            camera.zoom = Math.min(this.maxZoom, camera.zoom);
            camera.updateProjectionMatrix();
            this.zoomChanged = true;
        } else {
            this.enableZoom = false;
        }
        return this;
    }

    /** ***************
     *     Handlers
     ******************/
    private handleMouseDownRotate(event: MouseEvent) {
        // log('开始鼠标拖拽旋转');
        this.rotateStart.set(event.clientX, event.clientY);
    }

    private handleMouseDownDolly(event) {
        // log('开始鼠标拖拽缩放');
        this.dollyStart.set(event.clientX, event.clientY);
    }

    private handleMouseDownPan(event) {
        // log('开始鼠标拖拽平移');
        this.panStart.set(event.clientX, event.clientY);
    }

    /**
     * 响应鼠标拖拽旋转
     * @param {MouseEvent} event
     */
    private handleMouseMoveRotate(event: MouseEvent) {
        // log('拖拽旋转中');
        this.rotateEnd.set(event.clientX, event.clientY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);

        let element = this.domElement;

        // 速度为1的情况下, 从左拖到右, 定义为旋转一圈.
        this.rotateLeft(
            this.rotateDelta.x
            * 2 * Math.PI / element.clientWidth
            * this.rotateSpeed
        );
        // 速度为1的情况下, 从上拖到下, 定义为旋转一圈.
        // 但是实际上受制在180°内.
        this.rotateUp(
            this.rotateDelta.y
            * 2 * Math.PI / element.clientHeight
            * this.rotateSpeed
        );

        this.rotateStart.copy(this.rotateEnd);
        this.update();
    }

    /**
     * 响应鼠标拖拽缩放
     * @param {MouseEvent} event
     */
    private handleMouseMoveDolly(event: MouseEvent) {
        // log('拖拽缩放中');
        this.dollyEnd.set(event.clientX, event.clientY);
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
        if (this.dollyDelta.y > 0) {
            this.dollyIn(this.getZoomScale());
        } else if (this.dollyDelta.y < 0) {
            this.dollyOut(this.getZoomScale());
        }
    }

    /**
     * 响应鼠标拖拽平移
     * @param {MouseEvent} event
     */
    private handleMouseMovePan(event: MouseEvent) {
        // log('拖拽平移中');
        this.panEnd.set(event.clientX, event.clientY);
        this.panDelta.subVectors(this.panEnd, this.panStart);
        this.pan(this.panDelta.x, this.panDelta.y);
        this.panStart.copy(this.panEnd);
        this.update();
    }

    private handleMouseUp(event: MouseEvent) {
        // log('结束鼠标操作');
    }

    private handleMouseWheel(event: MouseWheelEvent) {
        // log('鼠标滚轮操作');
        if (event.deltaY < 0) {
            this.dollyOut(this.getZoomScale());
        } else if (event.deltaY > 0) {
            this.dollyIn(this.getZoomScale());
        }
        this.update();
    }

    private handleKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case this.keys.UP:
                this.pan(0, this.keyPanSpeed);
                this.update();
                break;
            case this.keys.BOTTOM:
                this.pan(0, -this.keyPanSpeed);
                this.update();
                break;
            case this.keys.LEFT:
                this.pan(this.keyPanSpeed, 0);
                this.update();
                break;
            case this.keys.RIGHT:
                this.pan(-this.keyPanSpeed, 0);
                this.update();
                break;
            default:
                break;
        }
    }

    private handleTouchStartRotate(event: TouchEvent) {
        this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    private handleTouchStartDolly(event: TouchEvent) {
        let dx = event.touches[0].pageX - event.touches[1].pageX;
        let dy = event.touches[0].pageY - event.touches[1].pageY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.dollyStart.set(0, distance);
    }

    private handleTouchStartPan(event: TouchEvent) {
        this.panStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    private handleTouchMoveRotate(event: TouchEvent) {
        this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
        let element = this.domElement;
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientWidth * this.rotateSpeed);
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight * this.rotateSpeed);
        this.rotateStart.copy(this.rotateEnd);
        this.update();
    }

    private handleTouchMoveDolly(event: TouchEvent) {
        let dx = event.touches[0].pageX - event.touches[1].pageX;
        let dy = event.touches[0].pageY - event.touches[1].pageY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.dollyEnd.set(0, distance);
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
        if (this.dollyDelta.y > 0) {
            this.dollyOut(this.getZoomScale());
        } else if (this.dollyDelta.y < 0) {
            this.dollyIn(this.getZoomScale());
        }
        this.dollyStart.copy(this.dollyEnd);
        this.update();
    }

    private handleTouchMovePan(event: TouchEvent) {
        this.panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        this.panDelta.subVectors(this.panEnd, this.panStart);
        this.pan(this.panDelta.x, this.panDelta.y);
        this.panStart.copy(this.panEnd);
        this.update();
    }


    /** ***************
     *     Events
     ******************/

    private onDblclick(event) {
        this.tCursor && this.tCursor.stop();
        let t0 = this.target.clone(),
            t1 = this.target.clone();
        this.tCursor = new Tween(t1);
        this.tCursor.easing(Easing.Quartic.Out)
            .to(this.cursor.clone(), 400)
            .onUpdate(() => {
                this.camera.position.x += t1.x - t0.x;
                this.camera.position.y += t1.y - t0.y;
                this.camera.position.z += t1.z - t0.z;

                this.target.x += t1.x - t0.x;
                this.target.y += t1.y - t0.y;
                this.target.z += t1.z - t0.z;
                t0 = t1.clone();
            })
            .start();
    }

    private onMouseDown(event) {
        // this.updateTraget(event);
        if (!this.enable) return;
        // 阻止浏览器默认行为
        event.preventDefault();

        if (event.button === this.mouseBottons.ORBIT) {
            if (!this.enableRotate) return;
            this.handleMouseDownRotate(event);
            this.state = STATE.ROTATE;
        } else if (event.button === this.mouseBottons.ZOOM) {
            if (!this.enableZoom) return;
            this.handleMouseDownDolly(event);
            this.state = STATE.DOLLY;
        } else if (event.button === this.mouseBottons.PAN) {
            if (!this.enablePan) return;
            this.handleMouseDownPan(event);
            this.state = STATE.PAN;
        }

        if (this.state !== STATE.NONE) {
            // this.domElement.parentElement.addEventListener('mousemove', this._onMouseMove, false);
            this.domElement.addEventListener('mouseup', this._onMouseUp, false);
            this.dispatchEvent(startEvent);
        }
    }

    private onMouseMove(event) {
        if (!this.enable) return;
        this.updateTraget(event);
        event.preventDefault();
        if (this.state === STATE.ROTATE) {
            if (!this.enableRotate) return;
            this.handleMouseMoveRotate(event);
        } else if (this.state === STATE.DOLLY) {
            if (!this.enableZoom) return;
            this.handleMouseMoveDolly(event);
        } else if (this.state === STATE.PAN) {
            if (!this.enablePan) return;
            this.handleMouseMovePan(event);
        }
    }

    private onMouseUp(event) {
        // this.domElement.parentElement.removeEventListener('mousemove', this._onMouseMove, false);
        this.domElement.removeEventListener('mouseup', this._onMouseUp, false);

        if (!this.enable) return;
        this.handleMouseUp(event);
        this.dispatchEvent(endEvent);
        this.state = STATE.NONE;
    }

    private onMouseWheel(event) {
        if (
            !this.enable ||
            !this.enableZoom ||
            ((this.state !== STATE.NONE) && (this.state !== STATE.ROTATE))
        ) return;

        event.preventDefault();
        event.stopPropagation();

        this.handleMouseWheel(event);

        requestAnimationFrame(this._dispatchEventStartDebounced);
        requestAnimationFrame(this._dispatchEventEndDebounced);

        // this.dispatchEvent(startEvent);
        // this.dispatchEvent(endEvent);
    }

    private onKeyDown(event) {
        if (
            !this.enable ||
            !this.enableKeys ||
            !this.enablePan
        ) return;
        this.handleKeyDown(event);
    }

    private onTouchStart(event) {
        if (!this.enable) return;
        // 区分手指数量
        // 1 旋转
        // 2 缩放
        // 3 平移
        switch (event.touches.length) {
            case 1:
                if (!this.enableRotate) return;
                this.handleTouchStartRotate(event);
                this.state = STATE.TOUCH_ROTATE;
                break;
            case 2:
                if (!this.enableZoom) return;
                this.handleTouchStartDolly(event);
                this.state = STATE.TOUCH_DOLLY;
                break;
            case 3:
                if (!this.enablePan) return;
                this.handleTouchStartPan(event);
                this.state = STATE.TOUCH_PAN;
                break;
            default:
                this.state = STATE.NONE;
                break;
        }
        if (this.state !== STATE.NONE) {
            this.dispatchEvent(startEvent);
        }
    }

    private onTouchMove(event) {
        if (!this.enable) return;
        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {
            case 1:
                if (
                    !this.enableRotate ||
                    this.state !== STATE.TOUCH_ROTATE
                ) return;
                this.handleTouchMoveRotate(event);
                break;
            case 2:
                if (
                    !this.enableZoom ||
                    this.state !== STATE.TOUCH_DOLLY
                ) return;
                this.handleTouchMoveDolly(event);
                break;
            case 3:
                if (
                    !this.enablePan ||
                    this.state !== STATE.TOUCH_PAN
                ) return;
                this.handleTouchMovePan(event);
                break;
            default:
                this.state = STATE.NONE;
                break;
        }
    }

    private onTouchEnd(event) {
        if (!this.enable) return;
        this.dispatchEvent(endEvent);
        this.state = STATE.NONE;
    }

    private onContextMenu(event) {
        event.preventDefault();
    }

    private dispatchEventStart() {
        this.dispatchEvent(startEvent);
    }

    private dispatchEventEnd() {
        this.dispatchEvent(endEvent);
    }

    private _onDblclick = this.onDblclick.bind(this);
    private _onMouseDown = this.onMouseDown.bind(this);
    private _onMouseMove = this.onMouseMove.bind(this);
    private _onMouseUp = this.onMouseUp.bind(this);
    private _onMouseWheel = this.onMouseWheel.bind(this);
    private _onKeyDown = this.onKeyDown.bind(this);
    private _onTouchStart = this.onTouchStart.bind(this);
    private _onTouchMove = this.onTouchMove.bind(this);
    private _onTouchEnd = this.onTouchEnd.bind(this);
    private _onContextMenu = this.onContextMenu.bind(this);
    private _dispatchEventStartDebounced = debounce(
        this.dispatchEventStart,
        TIME_QUICK_MOMENT,
        {
            'leading': true,
            'trailing': false
        }).bind(this);
    private _dispatchEventEndDebounced = debounce(
        this.dispatchEventEnd,
        TIME_QUICK_MOMENT,
        {
            'leading': false,
            'trailing': true
        }).bind(this);

    private async updateTraget(event: MouseEvent | MouseWheelEvent | TouchEvent) {
        if (this.isRaying) return;
        this.isRaying = true;
        let layerX = 0, layerY = 0,
            raycaster = this.raycaster,
            scene = this.scene,
            domElement = this.domElement;
        if (event instanceof MouseEvent) {
            let eventMouse = <MouseEvent>event;
            layerX = eventMouse.layerX;
            layerY = eventMouse.layerY;
        }
        let p2 = new Vector2(0, 0);
        p2.x = layerX / domElement.clientWidth * 2 - 1;
        p2.y = layerY / domElement.clientHeight * -2 + 1;
        raycaster.setFromCamera(p2, this.camera);
        let meshs: THREE.Mesh[];
        let timestamp = Date.now();
        if (timestamp - this.timestampIntersect > 500) {
            this.timestampIntersect = timestamp;
            meshs = await <THREE.Mesh[]>scene.children
                .filter((object3d: THREE.Object3D) => {
                    return object3d.name.indexOf('h-') > -1 || object3d.name.indexOf('hitable') > -1;
                });
        } else {
            meshs = await <THREE.Mesh[]>scene.children
                .filter((object3d: THREE.Object3D) => {
                    return object3d.name.indexOf('h-') > -1
                });
        }

        let intersects = raycaster.intersectObjects(meshs);
        this.hits.length = 0;
        this.hits.push(...intersects);
        if (intersects.length > 0) {
            let cursor = intersects[0].point;
            // console.log(intersects[0])
            // 引用对象, 不能直接对cursor赋值, 那样会丢失引用
            this.cursor.x = cursor.x;
            this.cursor.y = cursor.y;
            this.cursor.z = cursor.z;
        }
        this.isRaying = false;
    }
}

THREE.MouseControls = MouseControls;
