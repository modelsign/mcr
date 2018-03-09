import _comInst from '../../_common/instance'

import em from '../../bus';
import AudioPlayer from "./AudioPlayer";

em.emit('event/log/trace', {step: '初始化扩展, module_clipper'});


const instAudio = new AudioPlayer();


_comInst.modules.instAudio = instAudio;


export default {};

export let InstAudio = instAudio;
