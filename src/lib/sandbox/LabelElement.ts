import {Element, ElementConstructOption} from "../core/Element";
import {Vector3} from "../core/Vector3";
import {ElementOption} from "../core/ElementOption";
import {View} from "../core/View";
import Lang from '../lang'

class FaceElementConstructOption extends ElementConstructOption {
    constructor() {
        super()
    }
}


/**
 * 标签类型的枚举
 *
 * @readonly
 * @enum {number}
 */
enum LabelType {
    /** (实现中)简单标签, 仅包含一个无格式文本      **/     Simple,
    /** (规划)键值对, 标签会自动渲染若干组键值对  **/      Pair,
    /** (规划)视图标签, 标签会渲染传入的视图模板  **/      View
}

/**
 *
 */
class LabelContext {
    view: View;
}

/**
 * 标签实例的配置项
 *
 */
class LabelOption extends ElementOption {
    type: LabelType;
    position: Vector3;
    context: LabelContext | String = Lang.view_text_context_is_not_defined;
    zindex: number = 0;
}

/**
 * 该类用于定义一个位于三维场景中的文字(富文本)标签
 * 标签具有空间属性
 */
export class LabelElement extends Element {

    constructor(option: LabelOption) {
        super();

    }
}
