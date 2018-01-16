import {FaceElement} from "../sandbox/FaceElement";
import {LineElement} from "../sandbox/LineElement";
import {LabelElement} from "../sandbox/LabelElement";
import {ModelElement} from "../sandbox/ModelElement";
import {CameraController} from "../controller/CameraController";
import {DownloadController} from "../controller/DownloadController";
import {SceneController} from "../controller/SceneController";
import {EventEmitter} from "events";

class Sandbox {
    faces: FaceElement[] = [];
    lines: LineElement[] = [];
    labels: LabelElement[] = [];
    models: ModelElement[] = [];
}

class Option {
    mode: number = 0;
    afk: boolean = false;
}

class Controller {
    CameraController: CameraController = null;
    DownloadController: DownloadController = null;
    SceneController: SceneController = null;
    AnimaController: any = null;
}

class Graph {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
}

class Event {
    Emiter: EventEmitter = null
}


class InstClass {
    sandbox: Sandbox;
    option: Option;
    controller: Controller;
    graph: Graph;
    event: Event;
}


let inst: InstClass = new InstClass();
inst.sandbox = new Sandbox();
inst.option = new Option();
inst.controller = new Controller();
inst.graph = new Graph();
inst.event = new Event();

export default inst;
