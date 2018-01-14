const TWEEN = require('@tweenjs/tween.js');

const TIME_SECEND = 1000;


export class CameraController {
    _isMoving: Boolean = false;
    _tCamera: TWEEN.Tween = null;
    _tCameraOpt: any = {};
    camera: THREE.PerspectiveCamera;

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera;
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
            }

            this._tCameraOpt.x = camera.position.x;
            this._tCameraOpt.y = camera.position.y;
            this._tCameraOpt.z = camera.position.z;
            this._tCameraOpt.tx = _target.x;
            this._tCameraOpt.ty = _target.y;
            this._tCameraOpt.tz = _target.z;

            let _tCameraOpt = this._tCameraOpt,
                _tCamera = this._tCamera || new TWEEN.Tween(_tCameraOpt)

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
                    console.log(_tCameraOpt)
                    camera.lookAt(_target)
                })
                .start();
        });
    }


    async fly(positions: THREE.Vector3[], timeout: number = positions.length): Promise<THREE.PerspectiveCamera> {
        let camera = this.camera;

        return camera;
    }
}
