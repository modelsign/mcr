import _comInst from '../../_common/instance'

import em from '../../bus';
import {ModelClipper} from "./ModelClipper";

em.emit('event/log/trace', {step: '初始化扩展, module_clipper'});

const instClipper = new ModelClipper();
_comInst.modules.instClipper = instClipper;
export default {};

export let InstClipper = instClipper;
