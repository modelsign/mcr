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

class Option {
    mode: number = 0;
    afk: boolean = false;
    isWireframe: false;
}

class Controller {
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

class Graph {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    control: THREE.OrbitControls;
    cursor: THREE.Vector3
}

class Event {
    Emiter: EventEmitter = null
}

class InstClass {
    app: Vue;
    sandbox: Sandbox;
    option: Option;
    controller: Controller;
    graph: Graph = new Graph();
    event: Event;
    state: any = null;
    wild: {
        sync: any
    } = {sync: null};
    modules: any = {};
}

let inst: InstClass = new InstClass();
inst.sandbox = new Sandbox();
inst.option = new Option();
inst.controller = new Controller();
inst.graph = new Graph();
inst.event = new Event();


export default inst;
