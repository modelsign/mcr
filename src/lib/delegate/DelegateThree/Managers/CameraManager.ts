import {Tween, Easing} from '@tweenjs/tween.js'
import {ILocation} from "../../../data/ILocation";
import Point from "../../../data/Point";
import {EventDispatcher, Vector3} from "three";
import {debounce} from 'lodash';
import global from '../../../core/Global'

let MovingEvent = {type: 'moving'},
    MovedEvent = {type: 'moved'};

const TIME_SECEND = 1000;

export default class CameraManager extends EventDispatcher {
    private _camera: THREE.PerspectiveCamera;
    private _isMoving: boolean = false;
    private _tCamera: TWEEN.Tween = null;
    private _tCameraOpt: any = {};

    private tMove: Tween;

    constructor(camera: THREE.PerspectiveCamera) {
        super();
        this._camera = camera;

    }

    /**
     * 平滑移动相机到指定位置, 并朝向某个方向
     * @param {Vector3} position
     * @param {Vector3} target
     * @param {number} timeout
     * @return {Promise<PerspectiveCamera>}
     */
    moveTo(position: THREE.Vector3,
           target: THREE.Vector3,
           timeout: number = TIME_SECEND): Promise<THREE.PerspectiveCamera> {
        return new Promise((resolve) => {
            let camera: THREE.PerspectiveCamera = this._camera,
                direct: THREE.Vector3 = camera
                    .getWorldDirection()
                    .clone()
                    .multiplyScalar(position.distanceTo(camera.position)),
                _target = direct.add(camera.position);

            if (!target) {
                target = _target.clone().add(position.clone().sub(camera.position));
            } else {
                target = target.clone()
                    .sub(position)
                    .normalize()
                    .multiplyScalar(position.distanceTo(camera.position))
                    .add(position);
            }
            target = target.normalize();
            // _target.normalize();
            this._tCameraOpt.x = camera.position.x;
            this._tCameraOpt.y = camera.position.y;
            this._tCameraOpt.z = camera.position.z;
            this._tCameraOpt.tx = _target.x;
            this._tCameraOpt.ty = _target.y;
            this._tCameraOpt.tz = _target.z;

            let _tCameraOpt = this._tCameraOpt,
                _tCamera = this._tCamera || new Tween(_tCameraOpt);

            if (this._isMoving) {
                _tCamera.stop();
            } else {
                this._isMoving = true;
            }

            _tCamera.to({
                x: position.x,
                y: position.y,
                z: position.z,
                tx: target.x,
                ty: target.y,
                tz: target.z,
            }, timeout)
                .easing(Easing.Quartic.InOut)
                .onStart(() => {
                    global.isRend = true;
                })
                .onStop(() => {
                    global.isRend = false;
                    this.dispatchEvent(MovedEvent)
                })
                .onUpdate(() => {
                    global.isRend = true;

                    camera.position.x = _tCameraOpt.x;
                    camera.position.y = _tCameraOpt.y;
                    camera.position.z = _tCameraOpt.z;

                    _target.x = _tCameraOpt.tx;
                    _target.y = _tCameraOpt.ty;
                    _target.z = _tCameraOpt.tz;

                    camera.lookAt(_target);
                    this.dispatchEvent(MovingEvent)
                    // _comInst.graph.control.target = _target;
                })
                .onComplete(() => {
                    global.isRend = false;
                    camera.lookAt(target);
                    this.dispatchEvent(MovedEvent);
                    resolve(camera);
                })
                .start();
        });
    }
}


export class Movement {
    duration: number = 100;
    target: Vector3 = null;
}
