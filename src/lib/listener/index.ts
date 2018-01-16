import inst from '../_common/instance'
import {_SceneListener} from "./_SceneListener";
import {_CameraListener} from "./_CameraListener";
import {_ToolLitener} from "./_ToolLitener";

const TIME_SECONDS = 5000;

let em = inst.event.Emiter,
    scene = inst.graph.scene,
    camera = inst.graph.camera,
    toolCon = inst.controller.ToolController
;


let _sceneListener: _SceneListener,
    _cameraListerer: _CameraListener,
    _toolListener: _ToolLitener;


function init() {
    em = inst.event.Emiter;
    scene = inst.graph.scene;
    camera = inst.graph.camera;
    toolCon = inst.controller.ToolController;

    if (em && scene && camera && toolCon) {
        _sceneListener = new _SceneListener(scene);
        _cameraListerer = new _CameraListener(camera);
        _toolListener = new _ToolLitener(toolCon);
    } else {
        setTimeout(init, TIME_SECONDS);
    }
}


export default {}
