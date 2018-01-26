import _comInst from '../_common/instance'
import em from '../bus'
import {isUndefined} from "util";

const layer = require('layui-layer');
require('!style-loader!css-loader!layui-layer/layer.css');
const html2canvas = require('html2canvas');

export class ToolController {

    _initEventHandlers() {

        /**截图**/
        em.on('request/tool', (e: { action: string, arg: any } = {
            action: '',
            arg: {}
        }) => {
            switch (e.action) {
                case 'prtscn':
                    this.prtScn(e.arg.isIncludeBorder);
                    break;
                case 'inter':
                    this.interSwitch(e.arg.mode);
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * todo 截图功能不完善
     * @param {boolean} isIncludeBorder
     * @return {Promise<void>}
     */
    async prtScn(isIncludeBorder: boolean, isFullScreen: boolean = false) {
        em.emit('event/log/trace', {step: '截图'});
        if (isUndefined(isIncludeBorder)) {
            layer.msg(
                '选择输出样式',
                {
                    btn: ['含边框', '无边框', '全网页'],
                    btn1: (index) => {
                        this.prtScn(true);
                        layer.close(index);
                    },
                    btn2: (index) => {
                        this.prtScn(false);
                        layer.close(index);
                    },
                    btn3: (index) => {
                        setTimeout(() => {
                            this.prtScn(true, true);
                        }, 1000);
                        layer.close(index);
                    }
                },
                (index) => {

                },
                (index) => {

                });
        } else {
            let imgData;
            let platCon = _comInst.controller.PlatformController;

            // 全网页截图
            if (isFullScreen) {
                let domFull = document.body;
                let dom2Canvas = await html2canvas(
                    domFull,
                    {
                        allowTaint: true,
                        taintTest: false,
                    }
                );
                imgData = dom2Canvas.toDataURL('image/png');
            }
            // 含边框截图
            else if (isIncludeBorder) {
                let domPlat = platCon._platform;
                let dom2Canvas = await html2canvas(domPlat);
                imgData = dom2Canvas.toDataURL('image/png');
            }
            // 不含边框截图
            else {
                let render = _comInst.graph.renderer;
                imgData = render.domElement.toDataURL("image/png");
            }

            await platCon.exportFileDataURL(imgData, 'PrtScn.png');
        }
    }

    async interSwitch(mode: string) {
        switch (mode) {
            case 'orbit':
            case 'select':
                _comInst.state.current.interaction = mode;
                break;
            default:
                _comInst.state.current.interaction = 'orbit';
                break;
        }
    }

    constructor() {
        this._initEventHandlers();
    }
}
