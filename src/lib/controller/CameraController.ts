import TWEEN from '@tweenjs/tween.js';

const TIME_SECEND = 1000;


export class CameraController {

    _isMoving: Boolean = false;
    _tCameraPosition: TWEEN.Tween;
    _tCameraDirection: TWEEN.Tween;
    camera: THREE.PerspectiveCamera;

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera;


        this._tCameraPosition = new TWEEN.Tween(camera.position);
    }

    /**
     * 平滑移动相机到指定位置, 并朝向某个方向
     * @param {Vector3} position
     * @param {Vector3} direction
     * @param {number} timeout
     * @return {Promise<PerspectiveCamera>}
     */
    move(position: THREE.Vector3, direction: THREE.Vector3 = null, timeout: number = TIME_SECEND): Promise<THREE.PerspectiveCamera> {
        return new Promise((resolve) => {
            let camera = this.camera, direct = camera.getWorldDirection,
                tCameraPosition = this._tCameraPosition,
                tCameraDirection = new TWEEN.Tween(direct)
            ;
            if (this._isMoving) {
                tCameraPosition.stop();
            }
            this._isMoving = true;
            tCameraPosition.easing(TWEEN.Easing.Quartic.Out)
                .to(position, timeout)
                .onComplete(() => {
                    resolve(tCamera);
                })
                .start();
            tCameraDirection.easing(TWEEN.Easing.Quartic.Out).to(direction, timeout).start();
        });
    }

    fly(positions: THREE.Vector3[], timeout: number = positions.length): Promise<THREE.PerspectiveCamera> {

    }
}
