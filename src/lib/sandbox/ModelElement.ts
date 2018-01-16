import {Element} from "../core/Element";
import {Vector3} from "../core/Vector3";
import {IInteration} from "../interface/IInteration";
import {IPosture} from "../interface/IPosture";
import {IPosition} from "../interface/IPosition";

export abstract class ModelElement extends Element implements IInteration, IPosition, IPosture {

    /** ****************************************************************
     *
     *                         接口实现声明开始
     *↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
     *******************************************************************/

    /** **********************************
     * IInteration
     *************************************/

    /** **********************************
     * IPosition
     *************************************/
    position: Vector3;

    move(direction: Vector3, distance: Vector3) {

    }

    moveTo(position: Vector3) {

    }

    focus(option: {
        isFlash: boolean,
        isSound: boolean
    }): IPosition {

        return this;
    }

    /** **********************************
     * IPosture
     *************************************/
    rotation: Vector3;

    rotate(spin: Vector3): IPosture {
        return this;
    }

    /** ****************************************************************
     *↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
     *                         接口实现声明结束
     *
     *******************************************************************/

    isVisible: boolean;
    isHitable: boolean;

    type: string;

    constructor() {
        super();
    }
}
