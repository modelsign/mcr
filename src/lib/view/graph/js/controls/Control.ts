import ControlEnum from "./ControlEnum";
import MouseControls from "./MouseControls";
import LookControls from "./LookControls";

import em from '../../../../bus'

export class ControlOption {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    dom: Element;
    cursor: THREE.Vector3;
    hits: THREE.Intersection[];
}

export default class Control {
    private _mode: ControlEnum = ControlEnum.Mouse;
    private _control: any;

    private _option: ControlOption;

    private _mouseControl;
    private _touchLockControl;

    private _switchMode(val: ControlEnum | string) {
        this._control.enabled = false;
        switch (val) {
            case ControlEnum.Mouse:
            case 'mouse':
                val = ControlEnum.Mouse;
                this._control = this._mouseControl;
                break;
            case ControlEnum.MouseLock:
            case 'mouselock':
                val = ControlEnum.MouseLock;
                break;
            case ControlEnum.Touch:
            case 'touch':
                val = ControlEnum.Touch;
                break;
            case ControlEnum.TouchLock:
            case 'touchlock':
                val = ControlEnum.TouchLock;
                this._control = this._touchLockControl;
                break;
            default:
                return;
        }

        this._control.enabled = true;
        this._mode = val;
    }

    constructor(option: ControlOption) {
        this._option = option;
        let {scene, camera, dom, cursor, hits} = option;

        this._mouseControl = new MouseControls(scene, camera, dom, cursor, hits);
        this._touchLockControl = new LookControls(scene, camera, dom, cursor, hits, false);

        this._control = this._mouseControl;

        em.on('request/control', ({action, arg}) => {
            if (action === 'switch') {
                this._switchMode(arg);
                em.emit('event/log/trace', {step: `申请修改控制模式${arg}`, arg})
            }
        })
    }

    public get mode() {
        return this._mode;
    }

    public set mode(val: ControlEnum) {
        this._switchMode(val);
    }

    public get control() {
        return this._control;
    }

    public update() {
        return this._control.update();
    }
}

