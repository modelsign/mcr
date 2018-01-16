import _comInst from '../_common/instance'
import {Element} from "../core/Element";
import setPrototypeOf = Reflect.setPrototypeOf;
import em from '../bus';
import {Vector3} from "three";

const THREE = require('../../../vender/three');
const TWEEN = require('@tweenjs/tween.js');

const TIME_SECEND = 1000;

export class CameraController {
    _isMoving: Boolean = false;
    _tCamera: TWEEN.Tween = null;
    _tCameraOpt: any = {};
    camera: THREE.PerspectiveCamera;

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera;

        em.on('request/camera', (e: { action: string, arg: any } = {action: '', arg: {}}) => {
            let element = e.arg.element;
            if (e && e.action) {
                switch (e.action) {
                    case 'stop':
                        this._tCamera && this._tCamera.stop();
                        break;
                    case 'focus':
                        if (element) {
                            this.focusElement(element);
                        }
                        break;
                    case 'reset':
                        this.focusAll();
                        break;
                    default:
                        em.emit('event/log/trace', {step: `相机控制器无法处理动作${e.action}`});
                        break;
                }
            }
        });
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
            let camera: THREE.PerspectiveCamera = this.camera,
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
                _tCamera = this._tCamera || new TWEEN.Tween(_tCameraOpt);

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
                .easing(TWEEN.Easing.Quartic.InOut)
                .onUpdate(() => {
                    camera.position.x = _tCameraOpt.x;
                    camera.position.y = _tCameraOpt.y;
                    camera.position.z = _tCameraOpt.z;

                    _target.x = _tCameraOpt.tx;
                    _target.y = _tCameraOpt.ty;
                    _target.z = _tCameraOpt.tz;

                    camera.lookAt(_target);
                    _comInst.graph.control.target = _target;
                })
                .onComplete(() => {
                    camera.lookAt(target)
                    resolve(camera);
                })
                .start();
        });
    }


    /**
     * 聚焦相机到元素集合
     * @param {Element[]} element
     * @return {Promise<PerspectiveCamera>}
     */
    async focusElement(element: Element[]): Promise<THREE.PerspectiveCamera>;
    /**
     * 聚焦相机到单个元素
     * @param {Element} element
     * @return {Promise<PerspectiveCamera>}
     */
    async focusElement(element: Element): Promise<THREE.PerspectiveCamera>;
    async focusElement(element) {
        let elements = element;
        if (element instanceof Element) {
            em.emit('event/log/trace', {step: '聚焦到元素'});
        } else if (elements instanceof Array) {
            console.log(elements);
            em.emit('event/log/trace', {step: '聚焦到元素集合'});
        }

        return this.camera;
    }

    async focusAll(): Promise<THREE.PerspectiveCamera> {
        let scene = _comInst.graph.scene,
            sandbox = _comInst.sandbox,
            elementsAll;
        //
        // elementsAll = [].concat(sandbox.models);
        // this.focusElement(elementsAll);
        //

        /** **************************************
         * 直接读场景中的mesh, 使用以前的代码粗暴实现.
         *****************************************/
        let meshs = scene.children
            .filter((obj) => {
                return (obj instanceof THREE.Mesh)
            });

        let pBoxMax = new Vector3(-Infinity, -Infinity, -Infinity),
            pBoxMin = new Vector3(Infinity, Infinity, Infinity);
        let pCenter = meshs
            .map((mesh: THREE.Mesh) => {
                mesh.geometry.boundingSphere || mesh.geometry.computeBoundingSphere();
                mesh.geometry.boundingBox || mesh.geometry.computeBoundingBox();

                pBoxMax.x = Math.max(mesh.geometry.boundingBox.max.x, pBoxMax.x);
                pBoxMax.y = Math.max(mesh.geometry.boundingBox.max.y, pBoxMax.y);
                pBoxMax.z = Math.max(mesh.geometry.boundingBox.max.z, pBoxMax.z);
                pBoxMin.x = Math.min(mesh.geometry.boundingBox.min.x, pBoxMin.x);
                pBoxMin.y = Math.min(mesh.geometry.boundingBox.min.y, pBoxMin.y);
                pBoxMin.z = Math.min(mesh.geometry.boundingBox.min.z, pBoxMin.z);

                return mesh.geometry.boundingSphere.center;
            })
            .reduce((previous, current) => current.clone().add(previous))
            .multiplyScalar(1 / meshs.length);


        let direct = pBoxMax.sub(pBoxMin).multiplyScalar(0.5);
        let pCamera: Vector3 = direct.add(pCenter);

        await this.moveTo(pCamera, pCenter);

        return this.camera;
    }

    async fly(positions: THREE.Vector3[], timeout: number = positions.length): Promise<THREE.PerspectiveCamera> {
        let camera = this.camera;

        return camera;
    }
}
