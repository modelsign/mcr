import {Map} from 'immutable'

const uuid = require('eustia-module/eustia/uuid');
const THREE = require('three');

import _comInst from '../../_common/instance'
import '../../view/graph/js/controls/DragControls.js';
import '../../view/graph/js/controls/TransformControls.js';

class ModelClipperItem {
    _name: string;
    _meshs: THREE.Mesh[];
    _plans: THREE.Plane[];
    _visual_box: VisualBoxClipper;
    _isEditOn: boolean = false;
    _max: { x: 0, y: 0, z: 0 };
    _min: { x: 999999, y: 999999, z: 999999 };

    constructor(name: string = null, toClipElement: THREE.Mesh[] = null) {
        this._name = name || uuid();
        this._meshs = toClipElement;
        this._isEditOn = false;
        this._plans = [];

        if (this._meshs) {
            this.createClipBox();
        }

    }

    /**
     * 创建剖切体的盒子
     * @return {ModelClipperItem}
     */
    protected createClipBox(): ModelClipperItem {
        /**剖切体的包围盒 */
        let elementCenter = {x: 0, y: 0, z: 0},
            max = {x: 0, y: 0, z: 0}, min = {x: 999999, y: 999999, z: 999999};
        this._meshs.forEach((element) => {
            let {geometry} = element,
                {boundingSphere} = geometry,
                {center, radius} = boundingSphere,
                gmax, gmin;

            geometry.computeBoundingBox();
            gmax = geometry.boundingBox.max;
            gmin = geometry.boundingBox.min;
            max = {
                x: Math.max(gmax.x, max.x),
                y: Math.max(gmax.y, max.y),
                z: Math.max(gmax.z, max.z),
            };
            min = {
                x: Math.min(gmin.x, min.x),
                y: Math.min(gmin.y, min.y),
                z: Math.min(gmin.z, min.z),
            };
            elementCenter.x += (max.x + min.x) / 2;
            elementCenter.y += (max.y + min.y) / 2;
            elementCenter.z += (max.z + min.z) / 2;
        });
        elementCenter.x = elementCenter.x / this._meshs.length;
        elementCenter.y = elementCenter.y / this._meshs.length;
        elementCenter.z = elementCenter.z / this._meshs.length;


        this._visual_box = new VisualBoxClipper(max, min);

        return this;
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
        this._meshs.forEach((meshItem) => {
            let meshMaterial: any = meshItem.material;
            meshMaterial.clippingPlanes = meshMaterial.clippingPlanes.concat(this._plans);
        });

        return this;
    }

    /**
     * 关闭裁剪面编辑(交互式)
     * @return {ModelClipperItem} 自身对象
     */
    editOff(): ModelClipperItem {
        this._isEditOn = false;
        this._meshs.forEach((meshItem) => {
            let meshMaterial: any = meshItem.material;
            if (!meshMaterial.clippingPlanes) return;
            meshMaterial.clippingPlanes = meshMaterial.clippingPlanes.filter((plane) => {
                return !this._plans.find((item) => {
                    return plane === item
                })
            })
        });
        return this;
    };


}


/**
 * 设计思想
 *
 * cliper自己独立维护一个集合, 用于保存涉及到剖切的 __一组mesh__ 的集合
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
            throw '场景未初始化'
        }

    }

    /**
     *
     */
    get clipperModels(): ModelClipperItem[] {
        return this.models;
    }

    /**
     *
     */
    createClipperModel(): ModelClipperItem[] {
        return this.models;
    }


    /**
     *
     */
    removeClipperModel(removeItem: ModelClipperItem): ModelClipperItem[] {


        return this.models;
    }


}


/**
 * 设计思想
 *
 * 管理交互的剖切盒子
 */
export class VisualBoxClipper {

    _scene: THREE.Scene;
    _box_min: number[];
    _box_max: number[];
    _plans: THREE.Plane[];
    _meshBox: THREE.Mesh;

    /**
     *
     */
    constructor(box_max: {}, box_min: {}) {

        let scene = _comInst.graph.scene;
        if (!scene) {
            throw '场景未初始化'
        } else {
            let scope = this;
            scope._scene = _comInst.graph.scene;
            for (let key in box_min) {
                scope._box_min.push(box_min[key]);
            }

            for (let key in box_max) {
                scope._box_max.push(box_max[key]);
            }
            scope.createClipeBox();
        }


    }

    /**
     *  获得用于剖切
     */
    get clipperPlans(): THREE.Plane[] {
        return this._plans;
    }

    /**
     *  创建可视化的盒子的面
     */
    createClipeBox() {
        /**生成顶点 */
        let width = this._box_max[0] - this._box_min[0];
        let height = this._box_max[1] - this._box_min[1];
        let depth = this._box_max[2] - this._box_min[3];

        let cubeCenter = new THREE.Vector3((this._box_max[0] + this._box_min[0]) / 2, (this._box_max[1] + this._box_min[1]) / 2, (this._box_max[2] + this._box_min[2]) / 2)

        let geometry = new THREE.BoxGeometry(width, height, depth, 1, 1),
            color = 0xff0000,
            material = new THREE.MeshBasicMaterial({
                color: color,
                opacity: 0.2,
                depthWrite: false,
                side: THREE.DoubleSide,
                transparent: true
            });

        let meshBox = new THREE.Mesh(geometry, material);

        meshBox.name = 'clipBox';
        meshBox.position.x = cubeCenter.x;
        meshBox.position.y = cubeCenter.y;
        meshBox.position.z = cubeCenter.z;

        let xNormalize = new THREE.Vector3(1, 0, 0),
            yNormalize = new THREE.Vector3(0, 1, 0),
            zNormalize = new THREE.Vector3(0, 0, 1);

        meshBox.geometry.faces.forEach((iface) => {
            if (0 === iface.normal.angleTo(xNormalize)) {
                iface.name = 'px';
            } else if (Math.PI === iface.normal.angleTo(xNormalize)) {
                iface.name = 'nx';
            } else if (0 === iface.normal.angleTo(yNormalize)) {
                iface.name = 'py';
            } else if (Math.PI === iface.normal.angleTo(yNormalize)) {
                iface.name = 'ny';
            } else if (0 === iface.normal.angleTo(zNormalize)) {
                iface.name = 'pz';
            } else if (Math.PI === iface.normal.angleTo(zNormalize)) {
                iface.name = 'nz';
            }
        });

        this._scene.add(meshBox);
        this._meshBox = meshBox;

    }


}



