/**
 * 姿态接口. 表明该对象具有空间上的姿态控制
 */
import {Vector3} from "../core/Vector3";

export interface IPosture {

    rotate(spin: Vector3): IPosture;

    rotation: Vector3;
}
