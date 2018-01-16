/**
 * 空间位置接口. 表明该对象具有空间位置的操作方法
 */
import {Vector3} from "../core/Vector3";


export interface IPosition {

    move(direction: Vector3, distance: Vector3);

    moveTo(position: Vector3);

    focus(option: {
        isFlash: boolean,
        isSound: boolean
    }): IPosition;

    position: Vector3;
}
