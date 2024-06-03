import {makeAutoObservable} from "mobx";
import { PointData, PointType } from "@/types/points";
import {fetchLocationInfo, LocationInfo} from "@/fetch/fetchLocationInfo";
import {supportedFormats} from "@/const/formats";
import {TileModel} from "@/map/models/TileModel";
import {database, RoomModel} from "@/mocks/database";

export enum MapFormat {
    d2 = "d2",
    d3 = "d3"
}

class MapStore {

    format: MapFormat = MapFormat.d2;

    building = 5;

    locations: RoomModel[] = []

    floor = 1;

    existingFloors = [1, 2]; // idk maybe move it somewhere

    pathStart: PointData | null = null; // TODO: actual location
    pathEnd: PointData | null = null;
    currentLocation: PointData | null  = {
        id: 666,
        name: "Room 45",
        isCurrentLocation: true,
    }

    constructor() {
        makeAutoObservable(this);
    }

    setFloor = (floor: number) => {
        this.floor = floor;
    };

    setPathPoint = (type: PointType, location: PointData | null) => {
        if (type === PointType.START) {
            this.pathStart = location;
        } else {
            this.pathEnd = location;
        }
    }

    setMapFormat = (format: MapFormat) => {
        this.format = format;
    }

    private async loadLocations() {
        // this.locations = database
        // const locations = await fetchLocationInfo();
        // this.locations = locations;
    }

    getLocationInfo = (id: number) => {
        const location = this.locations.find((loc) => loc.id === id)
        return location ?? null;
    }
}

export const mapStore = new MapStore();

