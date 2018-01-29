import {FaceElement} from "../sandbox/FaceElement";
import {LineElement} from "../sandbox/LineElement";
import {LabelElement} from "../sandbox/LabelElement";
import {ModelElement} from "../sandbox/ModelElement";
import {CameraController} from "../controller/CameraController";
import {DownloadController} from "../controller/DownloadController";
import {SceneController} from "../controller/SceneController";
import {EventEmitter} from "events";
import {PlatformController} from "../controller/PlatformController";
import {ToolController} from "../controller/ToolController";
import {Sandbox} from "../sandbox/Sandbox";
import {Vue} from "vue/types/vue";
import em from '../bus';

const Fingerprint = require('fingerprintjs');
const fingerprint = new Fingerprint().get();

export class Option {
    mode: number = 0;
    afk: boolean = false;
    isWireframe: false;
}

export class Controller {
    CameraController: CameraController = null;
    DownloadController: DownloadController = null;
    SceneController: SceneController = null;
    AnimaController: any = null;
    PlatformController: PlatformController = null;
    ToolController: ToolController = null;

    constructor() {
        this.PlatformController = new PlatformController();
    }
}

export class Graph {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    control: THREE.OrbitControls;
    cursor: THREE.Vector3
}

export class Event {
    Emiter: EventEmitter = null
}

export class State {
    global: { online: number };
    current: any;
    menu: any;
    customize: any;
    setting: any;
    ui: any;
}

export class Local {
    firstuse: number = 0;
    lastuse: number = 0;
    usagecount: number = 0;
}

class InstClass {
    app: Vue;
    sandbox: Sandbox;
    option: Option;
    controller: Controller;
    graph: Graph = new Graph();
    event: Event;
    state: State;
    wild: any;
    local: Local;
    modules: any;
}

let inst: InstClass = new InstClass();
inst.sandbox = new Sandbox();
inst.option = new Option();
inst.controller = new Controller();
inst.graph = new Graph();
inst.event = new Event();
inst.state = {
    global: {
        online: 0
    },
    current: {
        fingerprint: fingerprint,
        isProcessing: false,
        status: '全局状态提示',
        camera: {
            position: {x: 0, y: 0, z: 0},
            direction: {x: 0, y: 0, z: 0}
        },
        point: {x: 0, y: 0, z: 0},
        /**
         * orbit.   鼠标交互拖拽交互模式, 该模式下鼠标拖拽控制相机移动
         * select.  鼠标交互框选模式, 该模式下鼠标左键框选模型
         */
        interaction: 'orbit',
        selects: [],
        hits: []
    },
    menu: {
        base: [
            {
                title: `拖拽模式`,
                icon: 'msign-orbit',
                isToggle: false,
                isActive: false,
                modes: ['orbit', 'select'],
                current: 0,
                callbackClick: function () {
                    this.current = (
                        this.current + 1
                    ) % this.modes.length;
                    let mode = this.modes[this.current];
                    this.icon = `msign-${mode}`;

                    switch (mode) {
                        case 'orbit':
                            this.title = `拖拽模式`;
                            break;
                        case 'select':
                            this.title = `框选模式`;
                            break;
                    }
                    em.emit('request/tool', {action: 'inter', arg: {mode}});
                    em.emit('event/log/trace', {step: `切换交互模式[${mode}]`});
                },
                callbackOn: null,
                callbackOff: null
            },
            {
                title: '全屏',
                icon: 'msign-zoomout',
                isToggle: true,
                isActive: false,
                callbackClick: null,
                callbackOn: function () {
                    this.isActive = true;
                    this.icon = 'msign-zoomin';
                    em.emit(
                        'request/container',
                        {
                            action: 'zoomout',
                            arg: {isFullScreen: true}
                        }
                    );
                    em.emit('event/log/trace', {step: `请求全屏`});
                },
                callbackOff: function () {
                    this.isActive = false;
                    this.icon = 'msign-zoomout';
                    em.emit(
                        'request/container',
                        {
                            action: 'zoomin',
                            arg: {isFullScreen: false}
                        }
                    );
                    em.emit('event/log/trace', {step: `请求取消全屏`});
                }
            },
            {
                title: `相机归位`,
                icon: 'msign-home',
                isToggle: false,
                isActive: false,
                callbackClick: function () {
                    em.emit(
                        'request/camera',
                        {action: 'reset', arg: {}}
                    );
                    em.emit('event/log/trace', {step: `请求相机归位`});
                },
                callbackOn: null,
                callbackOff: null
            },
            {
                title: `截图`,
                icon: 'msign-camera',
                isToggle: false,
                isActive: false,
                callbackClick: function () {
                    em.emit(
                        'request/tool',
                        {action: 'prtscn', arg: {}}
                    );
                    em.emit('event/log/trace', {step: `请求截屏`});
                },
                callbackOn: null,
                callbackOff: null
            }
        ],
        primary: [
            {
                title: '默认按钮',
                icon: 'msign-copyright'
            }
        ],
        advance: []
    },
    customize: {
        right: null
    },
    setting: {
        isDebug: false
    },
    ui: {}
};
inst.wild = {sync: null};
inst.modules = {};

export default inst;
