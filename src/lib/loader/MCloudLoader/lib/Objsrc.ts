import {Vector3} from "../../../core/Vector3";

export class Objsrc {
    id: string;

    source: string;
    tags: string[];

    self: string;

    /** ********************************************
     *         模型被某个具体空间引用后
     *         在空间中具有位置信息.
     ***********************************************/
    location: Vector3;
    geocode: number;
}
