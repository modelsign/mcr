import em from '../bus';
import lang from '../lang'
import _comInst from '../_common/instance'

em.on('event/log/trace', ({step}) => {
    if (_comInst.state && _comInst.state.setting.isDebug) {
        console.log(lang.logger_event_log_trace_F(), {step})
    }
});

export default {}
