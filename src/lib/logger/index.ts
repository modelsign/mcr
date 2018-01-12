import em from '../bus';
import lang from '../mcr/Lang'

em.on('event/log/trace', ({step}) => {
    console.log(lang.logger_event_log_trace_F(), {step})
});

export default {}
