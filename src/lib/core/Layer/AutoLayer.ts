import Layer from "./Layer";

import _comInst from '../../_common/instance'

const ajax = require('eustia-module/ajax');

export default class AutoLayer extends Layer {

    _restUrl: string = '';
    _scene: THREE.Scene;
    _camera: THREE.PerspectiveCamera;

    _objSrcMap: any = {};


    private _loadStart() {

    }

    private _loadStop() {

    }

    private _query(option: {
        host,
        space,
        geohash
    } = {
        host: '',
        space: '',
        geohash: ''
    }) {
        let geohash = option.geohash;

        ajax.get(
            {
                url: option.host + '/v1/space/objects?type=geohash&geohash=' + geohash,
                success(res) {
                    console.log(res);
                }
            }
        );

        /** *********************************************************************************************************
         *
         * 自动加载模型需要依赖接口规范
         * http://127.0.0.1:7001/v1/spaces/:space_id/objects?fliter=geohash&geohash=wtw37h
         *
         *      space_id,   指定图层所绑定的数据空间
         *      geohash,    指定当前加载空间位置的空间索引
         *
         * 按照约定, 服务器应当返回json
         *
         * {
         *    "meta":{
         *        "geohash":  "wxw27t"
         *        "layer":    "default",
         *       "count":    1
         *   },
         *   "data": [
         *       {
         *           "id": 10022018020600187,
         *           "type":"objsrcs",
         *           "attributes":{
         *               "objsrcid":10032018020600096,
         *               "location": {x:0,y:0,z:0},
         *               "url":"http://msign.oss.tool.budblack.me/10032018020600096",
         *               "created_at": "2018-02-06T12:53:28.000Z",
         *               "updated_at": "2018-02-06T12:53:28.000Z",
         *               "creator": 10012018020600028
         *           },
         *           "links":{
         *               "self":"http://127.0.0.1:7001/objsrc/10032018020600096"
         *           }
         *       }
         *   ]
         * }
         *
         *
         ************************************************************************************************************/

        let resultJson: {
            meta: { geohash: string, layer: string, count: number },
            data: {
                attributes: {}, links: {}
            }
        };

        /** **********************************
         * 拿到一个关于这个 geohash 的objsrc集合
         *************************************/
        let objs = [];

        // [{objsrcid,location,url}]
        this._objSrcMap[geohash] = objs.map((objsrc) => {
            let {objsrcid, location, url} = objsrc.attributes;
            return {objsrcid, location, url};
        });
    }

    constructor(rest) {
        super();

        this.type = 'auto';

        this._restUrl = rest;

        this._scene = _comInst.graph.scene;
        this._camera = _comInst.graph.camera;


        setInterval(this.refush.bind(this), 5000);
    }

    public refush() {

        let option = {
            host: 'http://127.0.0.1:7001',
            space: '10022018020600187',
            geohash: 'wtw37h'
        };
        this._query(option);
    }
}
