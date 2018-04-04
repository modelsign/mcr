import * as tween from '@tweenjs/tween.js';

import Bus from "./Bus";

export default class Global {
    static bus: Bus = new Bus();

    static async update(t) {
        tween.update(t);

        this.bus.emit('core/tick', t);
    }
}
