import { locationsURL } from "@/consts/fetchURLS";

export enum LocationType {
    CLASSROOM = "CLASSROOM",
    WC_WOMEN = "WC_WOMEN",
    WC_MEN = "WC_MEN",
    EXIT = "EXIT",
    BUFFET = "BUFFET",
    DIRECTORATE = "DIRECTORATE",
    DEPARTMENT = "DEPARTMENT",
    WARDROBE = "WARDROBE",
    DINNING_ROOM = "DINING_ROOM",
    ATM = "ATM",
    STAIRS = "STAIRS",
    DUTY_SERVICE = "DUTY_SERVICE"
}

type ScheduleItem = {
    subject: string;
    group: string;
    teacher: string;
};

export type LocationInfo = {
    displayName: string;
    type: LocationType; // You would need to define LocationType in TypeScript as well
    floor: string;
    building: string;
    stuff: string[] | null;
    indexOnTrack: string;
    schedule?: ScheduleItem[]; // Empty until backend implementation
};

export async function fetchLocationInfo() {
    const response = await fetch(locationsURL, {
        headers: { "Access-Control-Allow-Origin": "*" },
    });
    const data = await response.json();
    return data as LocationInfo[];
}
