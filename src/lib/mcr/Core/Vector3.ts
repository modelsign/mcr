export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x = 0, y = 0, z = 0) {

    }

    add(v: Vector3): Vector3 {
        return new Vector3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        )
    }

    multiply(k: number): Vector3 {
        return new Vector3(
            this.x * k,
            this.y * k,
            this.z * k
        )
    }
}
