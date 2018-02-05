import inst from '../_common/instance'
import {_SceneListener} from "./_SceneListener";
import {_CameraListener} from "./_CameraListener";
import {_ToolListener} from "./_ToolListener";
import {_MouseListener} from "./_MouseListener";
import {_IOListener} from "./_IOListener";

const TIME_SECONDS = 1000;

import em from '../bus'

inst.event.Emiter = em;
let scene = inst.graph.scene,
    camera = inst.graph.camera,
    toolCon = inst.controller.ToolController
;


let _sceneListener: _SceneListener,
    _cameraListerer: _CameraListener,
    _toolListener: _ToolListener,
    _mouseListener: _MouseListener,
    _ioListener: _IOListener;

function init() {
    scene = inst.graph.scene;
    camera = inst.graph.camera;
    toolCon = inst.controller.ToolController;

    if (em && scene && camera && toolCon) {
        _sceneListener = new _SceneListener(scene);
        _cameraListerer = new _CameraListener(camera);
        _toolListener = new _ToolListener(toolCon);
        _mouseListener = new _MouseListener(scene, null);
        _ioListener = new _IOListener();
    } else {
        setTimeout(init, TIME_SECONDS);
    }
}

init();

export default {}
