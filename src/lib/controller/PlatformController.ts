import _comInst from '../_common/instance'
import em from '../bus'
import {isUndefined} from "util";
import {setInterval} from "timers";

/**
 * 平台管理器, 管理整体组件的一些行为.
 */
export default class PlatformController {

    _exp = document.createElement('a');
    _platform;

    constructor() {
        this._initEventHandlers();
    }

    _initEventHandlers() {
        /**全屏**/
        em.on('request/container', (e: { action: string, arg: { isFullScreen: boolean } } = {
            action: '',
            arg: {isFullScreen: true}
        }) => {
            switch (e.action) {
                case 'zoomout':
                    this.displayFullScreen(e.arg.isFullScreen);
                    break;
                case 'zoomin':
                    this.displayFullScreen(e.arg.isFullScreen);
                    break;
                default:
                    break;
            }
        })
    }

    /**
     * 重设组件尺寸
     * @return {Promise<void>}
     */
    async displayResetSize() {

    }

    /**
     * 设置全屏
     * @param {boolean} isFullScreen 是否全屏
     * @return {Promise<void>}
     */
    async displayFullScreen(isFullScreen: boolean) {
        if (isUndefined(this._platform)) {
            this._platform = document.getElementById('mcr-platform');
            this.displayFullScreen(isFullScreen);
        } else {
            this.setFatherFrameFullScreen(window);
            if (isFullScreen) {
                let fullScreenElement: any = this._platform;
                let requestMethod = fullScreenElement.requestFullScreen ||
                    fullScreenElement.webkitRequestFullScreen ||
                    fullScreenElement.mozRequestFullScreen ||
                    fullScreenElement.msRequestFullScreen;
                if (requestMethod) {
                    requestMethod.call(fullScreenElement);
                }
            } else {

                let document: any = window.document;
                var exitMethod = document.exitFullscreen ||
                    document.mozCancelFullScreen ||
                    document.webkitExitFullscreen ||
                    document.webkitExitFullscreen;
                if (exitMethod) {
                    exitMethod.call(document);
                }
            }
        }
    }

    /**
     * 递归设置所有父级iframe ‘allowFullScreen’属性为true
     * @param {any} cuurentWindow 当前window
     */
    setFatherFrameFullScreen(cuurentWindow: any) {
        if (cuurentWindow.frameElement) {
            cuurentWindow.frameElement.setAttribute('allowFullScreen', 'true');
            let fatherWindow = cuurentWindow.parent;
            this.setFatherFrameFullScreen(fatherWindow);
        }
        return;
    }

    /**
     * 导出一份文件
     * @param {string} data 文件内容,UTF-8编码的文本内容
     * @param {string} filename 文件名称
     * @param {string} mime MIME-TYPE,如无指定则默认为text/plain
     * @return {Promise<void>}
     */
    async exportFileUtf8(data: string = '', filename: string = '未命名导出', mime: string = 'text/plain') {
        let exp = this._exp;
        exp.href = `data:${mime};charset=utf-8,\ufeff` + encodeURIComponent(data);
        exp.download = filename;
        exp.click();
    }

    async exportFileDataURL(data: string = '', filename: string = '未命名导出') {
        let exp = this._exp;
        exp.href = data;
        exp.download = filename;
        exp.click();
    }

}
