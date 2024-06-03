import {Vector3} from "three";

export type Edge = {
    from: number,
    to: number
}

export type NodeContent = {
    floor: number,
    building: string,
    pos: Vector3,
}
