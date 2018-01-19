import em from '../bus';

import (/* webpackChunkName: "module_debug" */'./debug/main.vue');
import(/* webpackChunkName: "module_clipper" */'./ModelClipper/main.ts');

em.emit('event/log/trace', { step: '加载扩展组件' });

export default {};
