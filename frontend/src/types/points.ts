export type PointData = {
    id: number;
    name: string;
    isCurrentLocation: boolean;
};

export enum PointType {
    START = "start",
    END = "end",
}