/** **************************************
 *
 * 本模块管理一些本地存储.
 *
 *****************************************/

import _comInst from '../../_common/instance'
import em from '../../bus'
import {EventStartup} from "./event/startup";
import Local from "../../_common/Local";

class LocalManager {
    local: Local;

    load(): Local {
        this.local = JSON.parse(localStorage.getItem('msign-local'));
        return this.local;
    }

    save(): Local {
        localStorage.setItem('msign-local', JSON.stringify(this.local));
        return this.local;
    }

    constructor() {
        let local = this.load();

        if (local) {
            local.usagecount += 1;
            local.lastuse = Date.now();
            this.save();
        } else {
            local = new Local();
            local.usagecount = 1;
            local.firstuse = Date.now();
            local.lastuse = Date.now();
            localStorage.setItem('msign-local', JSON.stringify(local));
        }

        let e = new EventStartup();
        e.firstuse = local.firstuse;
        e.lastuse = local.lastuse;
        e.usagecount = local.usagecount;
        e.currentime = local.lastuse;
        em.emit('localmanager/startup', e);
    }
}

export default new LocalManager();
