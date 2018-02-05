/**
 *
 */
import em from '../bus'

const toastr = require('../../../vender/toastr');

require('!style-loader!css-loader!less-loader!../../../vender/toastr/toastr.less');

export class _IOListener {
    constructor() {
        em.on(
            'io/msg',
            (msg) => {
                let _msg;
                try {
                    msg = msg.replace(/&quot;/g, '"');
                    _msg = JSON.parse(msg);
                    // console.log(_msg);
                    let {action, ctx} = _msg;
                    if (action === 'toastr') {
                        toastr.info(ctx)
                    }
                } catch (e) {
                    // console.log(msg);
                    // console.error(e)
                }
            }
        );
    }
}
