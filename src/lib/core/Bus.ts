import Vue from 'vue'

export default class Bus {

    private inst: Vue;

    async emit(event: string, ...args: any[]) {
        await this.inst.$emit(event, ...args);

        if (false) {

        } else if (/log\/.+/i.test(event)) {
            // 日志类消息
            this.inst.$emit('log', {event, args});
        } else if (/user\/.+/i.test(event)) {
            // 用户操作逻辑
            this.inst.$emit('user', {event, args});
        }

    }

    async on(event: string | string[], callback: Function) {
        await this.inst.$on(event, callback);
    }

    constructor() {
        this.inst = new Vue();
    }
}
