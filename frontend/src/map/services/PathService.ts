import {mapService} from "@/map/services/MapService";
import {TileModel} from "@/map/models/TileModel";
import {NavigationalTileType} from "@/map/models/NavigationalTileType";
import {TileType} from "@/map/models/TileType";

class Node {
    public x: number;
    public y: number;
    public g: number;
    public h: number;
    public f: number;
    public parent: Node | null;
    public floor: number;

    constructor(x: number, y: number, floor: number, g: number = 0, h: number = 0, parent: Node | null = null) {
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
        this.f = g + h;
        this.parent = parent;
        this.floor = floor;
    }
}

export class PathService {

    private stairs: TileModel[] = [];

    constructor() {
        mapService.getFloor(1).tiles.forEach(
            (tile) => {
                if (tile.navType === NavigationalTileType.STAIRS) {
                    this.stairs.push(tile);
                }
            }
        )
    }

    private isWalkable(tile: TileModel | null) {
        return tile?.navType == NavigationalTileType.PATH
            || tile?.type == TileType.DOOR
            || tile?.navType == NavigationalTileType.STAIRS;
    }

    private checkRoutesAround(tile: TileModel): boolean {
        return this.isWalkable(mapService.getTile(tile.x + 1, tile.y, tile.floorNumber)) ||
            this.isWalkable(mapService.getTile(tile.x - 1, tile.y, tile.floorNumber)) ||
            this.isWalkable(mapService.getTile(tile.x, tile.y + 1, tile.floorNumber)) ||
            this.isWalkable(mapService.getTile(tile.x, tile.y - 1, tile.floorNumber));
    }

    public findPath(start: TileModel, end: TileModel): null | TileModel[] {
        console.log(start, end)
        if (!this.checkRoutesAround(start) || !this.checkRoutesAround(end)) {
            console.error(`Tile ${start} or ${end} is unreachable.`);
            return null;
        }

        const nodes = this.findPathFromCoords(start.x, start.y, start.floorNumber, end.x, end.y, end.floorNumber);
        if (!nodes) {
            console.error("Can't find path :( " + start.x + ", " + start.y + " -> " + end.x + ", " + end.y);
            return null;
        }
        let path: TileModel[] = [];
        path.push(start);
        nodes.forEach((node) => {
            path.push(mapService.getTile(node.x, node.y, node.floor)!);
        });
        path.push(end);
        return path;
    }

    private findPathFromCoords(x1: number, y1: number, floor1: number, x2: number, y2: number, floor2: number): null | Node[] {
        if (floor1 !== floor2) {
            let closestStairs = this.findClosestStairs(x1, y1); // we'll assume stairs have the same coordinates
            if (!closestStairs) {
                console.error("Can't find stairs :( " + x1 + ", " + y1);
                return null;
            }

            const pathToStairs: null | Node[] = this.findPathFromCoords(x1, y1, floor1, closestStairs.x, closestStairs.y, floor1);
            const pathFromStairs: null | Node[] = this.findPathFromCoords(closestStairs.x, closestStairs.y, floor2, x2, y2, floor2);

            if (!pathToStairs || !pathFromStairs) {
                return null;
            }

            return [...pathToStairs, ...pathFromStairs];
        }

        const floor = floor1;

        let mapHeight = mapService.getMapHeight(floor);
        let mapWidth = mapService.getMapWidth(floor);

        const getTile: (x: number, y: number) => TileModel | null = (x, y) => {
            return mapService.getTile(x, y, floor);
        }

        const openSet: Node[] = [];
        const closedSet: Node[] = [];
        const startNode: Node = new Node(x1, y1, floor);
        const endNode: Node = new Node(x2, y2, floor);

        openSet.push(startNode);

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.f - b.f);
            let currentNode = openSet.shift();

            if (!currentNode) break;

            if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
                const path: Node[] = [];
                let current: Node | null = currentNode;
                while (current) {
                    path.push(current);
                    current = current.parent;
                }
                return path.reverse();
            }

            closedSet.push(currentNode);

            const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // Up, Down, Left, Right
            for (const [dx, dy] of directions) {
                const x = currentNode.x + dx;
                const y = currentNode.y + dy;

                if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) continue;

                const tile = getTile(x, y);
                if (!tile || !this.isWalkable(tile)) continue;

                const gNew = currentNode.g + 1; // We
                const hNew = Math.abs(x - endNode.x) + Math.abs(y - endNode.y); // Using Manhattan distance as heuristic
                const newNode = new Node(x, y, floor, gNew, hNew, currentNode);

                if (closedSet.find(n => n.x === newNode.x && n.y === newNode.y)) {
                    continue;
                }

                let existingNode = openSet.find(n => n.x === newNode.x && n.y === newNode.y);
                if (existingNode) {
                    if (existingNode.g > gNew) {
                        existingNode.g = gNew;
                        existingNode.f = gNew + existingNode.h;
                        existingNode.parent = currentNode;
                    }
                } else {
                    openSet.push(newNode);
                }
            }
        }
        return null;
    }

    private findClosestStairs(x1: number, y1: number): TileModel | null {
        let closestStair: TileModel | null = null;
        let minDistance: number = Infinity;

        this.stairs.forEach((stair) => {
            let distance = Math.abs(stair.x - x1) + Math.abs(stair.y - y1);
            if (distance < minDistance) {
                minDistance = distance;
                closestStair = stair;
            }
        });

        return closestStair;
    }
}

export const pathService = new PathService();
