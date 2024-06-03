import {TileType} from "@/map/models/TileType";
import {NavigationalTileType} from "@/map/models/NavigationalTileType";

export interface TileModel {
    id: number,
    x: number,
    y: number,
    type: TileType,
    navType: NavigationalTileType,
    floorNumber: number,
    value: number,
    direction: DirectionType
}

export enum DirectionType {
    RIGHT,
    LEFT,
    NONE
}
