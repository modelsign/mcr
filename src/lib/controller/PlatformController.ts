/**
 * 平台管理器, 管理整体组件的一些行为.
 */
export class PlatformController {

    _exp = document.createElement('a');
    _platform;

    constructor() {

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
