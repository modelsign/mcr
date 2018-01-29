import {Map} from 'immutable'

// const uuid = require('eustia-module/eustia/uuid');
const THREE = require('three');

import _comInst from '../../_common/instance'
import '../../view/graph/js/controls/DragControls.js';

class ModelClipperItem {
    _name: string;

    _meshs: THREE.Mesh[];
    _plans: THREE.Plane[];

    _isEditOn: boolean = false;

    constructor(name: string = null) {
        // this._name = name || uuid();
    }

    /**
     * 获得该单项条目的裁剪面集合
     * @return {Plane[]}
     * @constructor
     */
    get Plans(): THREE.Plane[] {
        // let meshs = this._meshs;
        // let clippingPlans: THREE.Plane[] = [];
        // if (meshs && meshs.length) {
        //     let mesh = meshs[0];
        //     let material: THREE.Material = mesh.material;
        //     clippingPlans = material.clippingPlanes;
        // }

        return this._plans;
    }

    get Meshs(): THREE.Mesh[] {
        return this._meshs;
    }

    /** ******************************************
     *  以下是各个操作函数, 函数应当返回对象自身
     *  从而实现对连式操作的支持
     *********************************************/

    /**
     * 开启裁剪面编辑(交互式)
     * @return {ModelClipperItem} 自身对象
     */
    editOn(): ModelClipperItem {
        this._isEditOn = true;

        return this;
    }

    /**
     * 关闭裁剪面编辑(交互式)
     * @return {ModelClipperItem} 自身对象
     */
    editOff(): ModelClipperItem {
        this._isEditOn = false;

        return this;
    }

    createPlan(v: THREE.Vector3, n: THREE.Vector3): ModelClipperItem {
        // let plan = new THREE.Plane()
        // this._plans.push()


        return this;
    }
}


/**
 * 设计思想
 *
 * cliper自己独立维护一个集合, 用于保存涉及到刨切的 __一组mesh__ 的集合
 * 所有的刨切动作都是操作在集合单项上的
 */
export class ModelClipper {

    _scene: THREE.Scene;

    models: ModelClipperItem[];

    /**
     *
     */
    constructor() {

        let scene = _comInst.graph.scene;
        if (!scene) {
            throw '场景为初始化'
        }

    }
}
