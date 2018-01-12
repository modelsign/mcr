import {Vector3} from "./Vector3";

/**
 * 元素配置对象基类
 *
 * 定义一系列元素配置的公共项
 *
 */
export abstract class ElementOption {
    // abstract createDefaultConstructOption();

    isVisible: Boolean = true;
    isHitable: Boolean = false;
    isEditable: Boolean = false;
    isInternal: Boolean = false;
}
