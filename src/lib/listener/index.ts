import inst from '../_common/instance'
import {_SceneListener} from "./_SceneListener";
import {_CameraListener} from "./_CameraListener";

const TIME_SECONDS = 5000;

const em = inst.event.Emiter,
    scene = inst.graph.scene,
    camera = inst.graph.camera
;


let _sceneListener: _SceneListener,
    _cameraListerer: _CameraListener;


function init() {
    if (em && scene && camera) {

        _sceneListener = new _SceneListener(scene);
        _cameraListerer = new _CameraListener(camera)

    } else {
        setTimeout(init, TIME_SECONDS)
    }
}


export default {}
