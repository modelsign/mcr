import {FaceElement} from "../sandbox/FaceElement";
import {LineElement} from "../sandbox/LineElement";
import {LabelElement} from "../sandbox/LabelElement";
import {ModelElement} from "../sandbox/ModelElement";
import {CameraController} from "../controller/CameraController";
import {DownloadController} from "../controller/DownloadController";
import {SceneController} from "../controller/SceneController";
import {PlatformController} from "../controller/PlatformController";
import {ToolController} from "../controller/ToolController";

export default class Controller {
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
