import _comInst from '../_common/instance'
import em from '../bus'
import {isUndefined} from "util";
import {Component} from "vue";

export class CustomizeContrller {

    /**
     * 设置自定义功能区内的功能视图
     * @param {string} region
     * @param {Component} view
     * @return {Promise<Component>}
     */
    async switchCustomizeRegion(region: string, view: Component): Promise<Component> {


        return view;
    }
}
