import *as Logline from 'logline'
import global from '../core/Global'
import {LogRuntime} from "../core/Log";

Logline.using(Logline.PROTOCOL.INDEXEDDB);

/** ********************************************************
 *
 * 区分会话, 实例化不同名称空间的日志对象
 *
 * runtime      运行日志 对运行时的内部行为进行无差别记录
 * useraction   用户行为 对用户的主观操作行为进行记录.
 * statistics   统计日志 记录定时触发的系统状态统计结果.
 *
 ***********************************************************/

let logRuntime = new Logline('runtime'),
    logUseraction = new Logline('useraction'),
    logStatistics = new Logline('statistics');
logRuntime.info('init.succeed');

// // 包含错误描述数据，描述为 init.failed 的记录
// spaLog.error('init.failed', {
//     retcode: 'EINIT',
//     retmsg: 'invalid signature'
// });
//
// // 不包含数据的，描述为 outdated 的记录
// // sdkLog.warning('outdated');
//
// // 包含错误描述数据，描述为 system.vanish 的记录
// sdkLog.critical('system.vanish', {
//     // debug infos here
// });

let {bus} = global;
bus.on('log', (ctx) => {
    let {event, args} = ctx;

    switch (event) {
        case 'log/runtime':
            logRuntime.info('', args);
            break;
    }

});
bus.on('user', (ctx) => {
    console.log('user', ctx)
});


export default {}
