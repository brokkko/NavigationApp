import {TileModel} from "@/map/models/TileModel";
import LoadMapService from "@/map/services/LoadMapService";
import { TileType } from "../models/TileType";
import { NavigationalTileType } from "../models/NavigationalTileType";

type Floor = {
    tiles: TileModel[];
    floorNumber: number;
    width: number;
    height: number;
}

class MapService {
    private floors: Floor[] = [];

    constructor() {
        let loadService = new LoadMapService();
        let floorAmount = 2;
        for (let i = 1; i <= floorAmount; i++) {
            this.floors.push({
                tiles: loadService.loadFloorTiles(i),
                floorNumber: i,
                width: loadService.getFloorWidth(i),
                height: loadService.getFloorHeight(i)
            });
        }
    }

    getMapHeight(floorNumber: number): number {
        return this.floors[floorNumber - 1].height;
    };
    getMapWidth(floorNumber: number): number {
        return this.floors[floorNumber - 1].width;
    };
    getTile(x: number, y: number, floor:number) : TileModel | null {
        for (let i = 0; i < this.floors[floor - 1].tiles.length; i++) {
            if (this.floors[floor - 1].tiles[i].x === x && this.floors[floor - 1].tiles[i].y === y) {
                return this.floors[floor - 1].tiles[i];
            }
        }
        return null;
    };

    getById(id: number | undefined): TileModel | null {
        console.log(id)
        if (id === 111) {
            return this.floors[0].tiles[210];
        }
        if (id === 215) {
            return this.floors[1].tiles[252];
        }
        for (let i = 0; i < this.floors[0].tiles.length; i++) {
            if (this.floors[0].tiles[i].id === id) {
                return this.floors[0].tiles[i];
            }
        }
        for (let i = 0; i < this.floors[1].tiles.length; i++) {
            if (this.floors[1].tiles[i].id === id) {
                return this.floors[1].tiles[i];
            }
        }
        return null;
    }

    getAllTilesByValue(value: number, floor: number): TileModel[] {
        return this.floors[floor - 1].tiles.filter(tile => tile.value === value);
    }

    getFloor(floorNumber: number): Floor {
        return <Floor>this.floors.find(floor => floor.floorNumber === floorNumber);
    }

    getAllTilesByNavType(navType: NavigationalTileType, floor: number): TileModel[] {
        return this.floors[floor - 1].tiles.filter(tile => tile.navType === navType);
    }

    getRoomCenter(x: number, y: number, floor: number) {
        let roomDirection;
        if (this.getTile(x + 1, y, floor)?.navType === NavigationalTileType.PATH) {
          roomDirection = "r";
        } else if (
          this.getTile(x - 1, y, floor)?.navType === NavigationalTileType.PATH
        ) {
          roomDirection = "l";
        } else if (
          this.getTile(x, y + 1, floor)?.navType === NavigationalTileType.PATH
        ) {
          roomDirection = "u";
        } else {
          roomDirection = "d";
        }
    
        let midY = y;
        let midX = x;
        if (["u", "d"].includes(roomDirection)) {
            let step = roomDirection === "u" ? -1 : 1;
            let startY = y;
            let startX = x;
            let startTile = this.getTile(x, startY, floor);
            while (startTile?.type !== TileType.WALL) {
                startY+= step;
                startTile = this.getTile(x, startY, floor);
            }
            midY = Math.floor((y+startY) / 2);
            startTile = this.getTile(x, midY , floor);
            step = 1;
            while (startTile?.type !== TileType.WALL) {
                startX += step;
                startTile = this.getTile(startX, midY , floor);
            }
            let xTop = startX;
            startTile = this.getTile(x, midY , floor);
            step = -1;
            while (startTile?.type !== TileType.WALL) {
                startX += step;
                startTile = this.getTile(startX, midY , floor);
            }
            let xBottom = startX;
            midX = Math.floor((xTop + xBottom) / 2)
        } else {
            let step = roomDirection === "r" ? -1 : 1;
            let startY = y;
            let startX = x;
            let startTile = this.getTile(startX, y, floor);
            while (startTile?.type !== TileType.WALL) {
                startX += step;
                startTile = this.getTile(startX, y, floor);
            }
            midX = Math.floor((x+startX) / 2);
            startTile = this.getTile(midX, y , floor);
            step = 1;
            while (startTile?.type !== TileType.WALL) {
                startY += step;
                startTile = this.getTile(midX, startY , floor);
            }
            let yTop = startY;
            startTile = this.getTile(midX, y , floor);
            step = -1;
            while (startTile?.type !== TileType.WALL) {
                startY += step;
                startTile = this.getTile(midX, startY , floor);
            }
            let yBottom = startY;
            midY = Math.floor((yTop + yBottom) / 2)
        }
        return {x: midX, y: midY}
    
      }
}

export const mapService = new MapService();
