import {FaceElement} from "../sandbox/FaceElement";
import {LineElement} from "../sandbox/LineElement";
import {LabelElement} from "../sandbox/LabelElement";
import {ModelElement} from "../sandbox/ModelElement";
import {CameraController} from "../controller/CameraController";
import {DownloadController} from "../controller/DownloadController";
import {SceneController} from "../controller/SceneController";

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

let inst: any = {};
inst.sandbox = new Sandbox();
inst.option = new Sandbox();
inst.controller = new Sandbox();

export default inst;
