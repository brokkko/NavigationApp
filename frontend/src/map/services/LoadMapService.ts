import {DirectionType, TileModel} from "@/map/models/TileModel";
import floor1 from "../utils/floor1.json";
import floor2 from "../utils/floor2.json";
import {TileType} from "@/map/models/TileType";
import {NavigationalTileType} from "@/map/models/NavigationalTileType";

type Floor = {
    data: number[] | undefined;
    width: number | undefined;
    height: number | undefined;
}

type Room = {
    number: number,
    floor: number,
    x: number,
    y: number,
}
export default class LoadMapService {

    private idsFloor1: number[] = [];
    private idsFloor2: number[] = [];

    constructor() {
        floor1.layers.forEach(layer => {
            if (layer.name === "ids") {
                this.idsFloor1 = layer.data;
            }
        });
        floor2.layers.forEach(layer => {
            if (layer.name === "ids") {
                this.idsFloor2 = layer.data;
            }
        });
    }

    private getFloor(floorNumber: number) : Floor {
        if (floorNumber === 1) {
            return {
                data: floor1.layers[0].data,
                width: floor1.layers[0].width,
                height: floor1.layers[0].height
            };
        }
        if (floorNumber === 2) {
            return {
                data: floor2.layers[0].data,
                width: floor2.layers[0].width,
                height: floor2.layers[0].height
            };
        }
        return {
            data: undefined,
            width: undefined,
            height: undefined
        };
    }

    private getFloorNavigationData(floorNumber: number) : Floor {
        if (floorNumber === 1) {
            return {
                data: floor1.layers[1].data,
                width: floor1.layers[1].width,
                height: floor1.layers[1].height
            };
        }
        if (floorNumber === 2) {
            return {
                data: floor2.layers[1].data,
                width: floor2.layers[1].width,
                height: floor2.layers[1].height
            };
        }
        return {
            data: undefined,
            width: undefined,
            height: undefined
        };
    }

    loadFloorTiles(floorNumber: number) : TileModel[] {
        const tileModels: TileModel[] = [];
        let floor = this.getFloor(floorNumber);
        floor?.data?.forEach((tile: number, index: number) => {
            let idValue = 0;
            if (floorNumber === 1) {
                idValue = this.idsFloor1[index];
            }
            if (floorNumber === 2) {
                idValue = this.idsFloor2[index];
            }
            tileModels.push({
                id: idValue,
                x: index % floor.width!,
                y: Math.floor(index / floor.width!),
                type: this.getTileType(tile),
                navType: this.getIsRoute(index, floorNumber),
                floorNumber: floorNumber,
                value: this.getNavValueData(index, floorNumber),
                direction: this.getDirection(tile, index, floorNumber)
            });
        });
        return tileModels;
    }

    private getDirection(tile: number, index: number, floorNumber: number) : DirectionType {
        if (this.getTileType(tile) === TileType.DOOR || this.getNavType(index) === NavigationalTileType.ENTRANCE) {
            let data = this.getFloor(floorNumber).data;
            if (data) {
                if (this.getTileType(data[index + 1]) === TileType.WALL) {
                    return DirectionType.LEFT;
                }
                return DirectionType.RIGHT;
            }
            return DirectionType.NONE;
        }
        return DirectionType.NONE;
    }

    private getNavValueData(index: number, floorNumber: number) : number {
        let data = this.getFloorNavigationData(floorNumber).data;
        if (data !== undefined) {
            return data[index];
        } else {
            return 0;
        }
    }

    private getIsRoute( index: number, floorNumber: number) : NavigationalTileType {
        let data = this.getFloorNavigationData(floorNumber).data;
        if (data !== undefined) {
            return data[index] as NavigationalTileType;
        } else {
            return NavigationalTileType.NONE;
        }
    }

    private getNavType(tile: number) : NavigationalTileType {
        if (tile === 7) {
            return NavigationalTileType.STAIRS;
        }
        if (tile === 8) {
            return NavigationalTileType.ELEVATORS;
        }
        if (tile === 9) {
            return NavigationalTileType.WC;
        }
        if (tile === 6) {
            return NavigationalTileType.ENTRANCE;
        }
        if (tile === 10) {
            return NavigationalTileType.INFO;
        }
        if (tile === 4) {
            return NavigationalTileType.PATH;
        }
        return NavigationalTileType.NONE;

    }

     private getTileType(id: number) {
        if (id === 1) {
            return TileType.WALL;
        }
        if (id === 3) {
            return TileType.DOOR;
        }
        if (id === 2) {
            return TileType.FLOOR;
        }

        return TileType.NONE;
    }

    getFloorHeight(floorNumber: number): number  {
        return <number>this.getFloor(floorNumber).height;
    }

    getFloorWidth(floorNumber: number): number {
        return <number>this.getFloor(floorNumber).width;
    }
}
