import * as tween from '@tweenjs/tween.js';

import Bus from "./Bus";
import DelegateThree from "../delegate/DelegateThree";

export default class Global {
    static bus: Bus = new Bus();
    static delegateThree: DelegateThree = null;

    static async update(t) {
        tween.update(t);
        this.bus.emit('core/tick', t);
    };

    static isRend: boolean = false
}
