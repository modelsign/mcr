/**
 * 空间索引表
 */
import {Vector3} from "../../../core/Vector3";
import {Objsrc} from "./Objsrc";

export class Space extends Array {

    spaceId: string;

    objsrcCached: Objsrc[];

    async selectRange(center: Vector3, range: number): Promise<Objsrc[]> {

        let objsrcInrange: Objsrc[] = [];

        return objsrcInrange;
    }


}
