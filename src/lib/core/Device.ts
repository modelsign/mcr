import {Record} from 'immutable'
import global from './Global'

const device = Record({
    cid: '',
    ua: ''
});

global.bus.emit('log/runtime', {ctx: 'local.device.init'})
