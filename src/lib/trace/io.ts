import _comInst from '../_common/instance'
import em from '../bus'

const io = require('socket.io-client');
const Fingerprint = require('fingerprintjs');
const fingerprint = _comInst.state.current.fingerprint;

const ajax = require('eustia-module/ajax');
let urlIO = '//io.tool.budblack.me';
let option = {
        reconnectionDelay: 10 * 1000,
        reconnectionAttempts: 3,
    },
    socket = io(urlIO, option);

socket.on('connect', function () {
    socket.emit('login', fingerprint);
});
socket.on('new_msg', function (msg) {
    em.emit('io/msg', msg);
});
socket.on('update_online_count', function (online_stat) {
    try {
        online_stat = JSON.parse(online_stat);
        let {online_count_now} = online_stat;
        // console.log(online_stat)
        _comInst.state.global.online = online_count_now;
    } catch (e) {
    }
});
