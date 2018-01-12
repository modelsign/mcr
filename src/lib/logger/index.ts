import em from '../bus';
import lang from '../lang'

em.on('event/log/trace', ({step}) => {
    console.log(lang.logger_event_log_trace_F(), {step})
});

export default {}
