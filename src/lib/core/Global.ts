import * as tween from '@tweenjs/tween.js';

import Bus from "./Bus";
import DelegateThree from "../delegate/DelegateThree";
import FactoryThree from "../delegate/DelegateThree/FactoryThree";

export default class Global {
    static bus: Bus = new Bus();
    static delegateThree: DelegateThree = null;
    static factoryThree: FactoryThree = FactoryThree;

    static async update(t) {
        tween.update(t);

        /** ******************************************************
         * 广播时钟信号
         * 原则上组件内部不需要自己实例化计时器, 通过订阅系统广播的时钟信号
         * 完成计时动作, 以便于统一管理休眠.
         *********************************************************/
        //todo 进一步设计 休眠/运作 状态
        this.bus.emit('core/tick', t);
    };

    static isRend: boolean = true
}
