import {EventUIProgress} from "../bus/events/ui/progress";

// const THREE = require('three');

declare let THREE: { GLTFLoader, FBXLoader };
import '../view/graph/js/loaders/LoaderUtils.js'
import '../view/graph/js/loaders/GLTFLoader.js'
import '../view/graph/js/loaders/FBXLoader.js'
import Lang from '../lang'

import em from '../bus';

class Loader {

    private static async _onProgress(xhr) {
        em.emit('scene/loader/progress', xhr);

        let xhrId = xhr.currentTarget.responseURL;
        if (xhr.total > 0) {
            let progress = xhr.loaded / xhr.total;
            /** ***************************************************************
             * 派发若干事件
             * event/log/trace      调试跟踪用
             * event/ui/progress    通用的进度条更新, UI组件上订阅这个事件用于绘制UI
             ******************************************************************/
            em.emit('event/log/trace', {step: `下载: ${(progress * 100).toFixed(0)}%`});
            em.emit('event/ui/progress', new EventUIProgress(xhrId, progress));
        } else {
            let progress = xhr.loaded;
            em.emit('event/log/trace', {step: `下载: ${(progress / 1024 / 1024).toFixed(2)}MB`});
            em.emit('event/ui/progress', new EventUIProgress(xhrId, (progress % 10 / 10)));
        }
    }

    private static async _onLoadGltf(gltf, url) {
        em.emit('event/log/trace', {step: `下载完成`});
        setTimeout(() => {
            em.emit('event/ui/progress', new EventUIProgress(url, 1));
        }, 30000);

        let scene = gltf.scene;
        let meshs = gltf.scene.children;

        if (gltf) {
            return scene;
        }
    }

    static async loadModelGltf(url) {
        em.emit('event/log/trace', {step: `Gltf,${Lang.view_start_loading}`});

        let loader = new THREE.GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load(
                url,
                (gltf) => {
                    resolve(Loader._onLoadGltf(gltf, url))
                },
                Loader._onProgress
            );
        });
    }

    static async loadModelFBX(url) {
        let loader = new THREE.FBXLoader();

        loader.load(url, function (object) {
            console.log('FBX 模型', object);
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

        });

    }

    static async loadMCloud(url) {
        em.emit('event/log/trace', {step: `载入自动图层: ${url}`});
    }

}

export default Loader;
