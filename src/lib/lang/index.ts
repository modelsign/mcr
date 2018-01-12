/**
 * 运行时涉及到的文本内容
 * @type {{can_not_construct_abstract_class: string}}
 */
const textRuntime = {
        runtime_can_not_construct_abstract_class: 'Can not construct abstract class.',
    },
    /**
     * 视图模块中涉及到的提示性内容
     * @type {{text_context_is_not_defined: string}}
     */
    textView = {
        view_text_context_is_not_defined: 'Text context is not defined.',
        view_start_loading: 'Start loading.'
    },
    textLogger = {
        logger_event_log_trace_F: () => {
            return `Event trace. ${(new Date()).toISOString()}.`
        }
    };


let currText = Object.assign({}, textRuntime, textView, textLogger);

export default currText
