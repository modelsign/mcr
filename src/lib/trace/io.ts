import _comInst from '../_common/instance'

const io = require('socket.io-client');
const Fingerprint = require('fingerprintjs');
const fingerprint = new Fingerprint({canvas: true}).get();

let socket = io('//io.tool.budblack.me');
socket.on('connect', function () {
    socket.emit('login', fingerprint);
});
socket.on('new_msg', function (msg) {
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
