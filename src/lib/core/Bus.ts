import {EventEmitter} from 'events';
import {log} from "util";

export default class Emitter extends EventEmitter {


    constructor() {
        super();
    }

    emit(event, data) {

        switch (event) {
            case 'core/tick':
                break;
            default:
                log(JSON.stringify({event, data}));
                break;
        }

        return super.emit(event, data);
    }
}
