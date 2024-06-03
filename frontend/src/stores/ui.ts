import AllClassroomsSheet from "@/components/BottomSheet/AllClassroomsSheet/AllClassroomsSheet";
import ClassroomSheet from "@/components/BottomSheet/ClassroomSheet/ClassroomSheet";
import RouteSheet from "@/components/BottomSheet/RouteSheet/RouteSheet";
import { makeAutoObservable } from "mobx";
import { FunctionComponent } from "react";
import CommonOverlay from "@/components/Overlay/Common";
import SelectionOverlay from "@/components/Overlay/Selection";
import PathOverlay from "@/components/Overlay/Path";
import { LocationInfo } from "@/fetch/fetchLocationInfo";
import {TileModel} from "@/map/models/TileModel";
import {RoomModel} from "@/mocks/database";

export enum SheetType {
    CLASSROOMS,
    ROUTE,
}

const componentByType: Map<SheetType, FunctionComponent> = new Map([
    [SheetType.CLASSROOMS, AllClassroomsSheet],
    [SheetType.ROUTE, RouteSheet],
]);

type SheetData = {
    Component: FunctionComponent<any>;
    props?: object;
};

export enum OverlayType {
    COMMON,
    SLECTION,
    PATH,
}

const overlayByType: Map<OverlayType, FunctionComponent<any>> = new Map([
    [OverlayType.COMMON, CommonOverlay],
    [OverlayType.PATH, PathOverlay],
    [OverlayType.SLECTION, SelectionOverlay],
]);

class UIStore {
    constructor() {
        makeAutoObservable(this);
    }

    openedSheet: SheetData | null = null;
    showCommonInfo: boolean = false;
    overlay: SheetData = { Component: CommonOverlay };

    openGenericSheet = (type: SheetType, props?: any) => {
        this.openedSheet = {
            Component: componentByType.get(type)!,
            props
        };
    };

    openClassroomSheet = (info: RoomModel) => {
        console.log("yes")
        console.log(info)
        // TODO: как props для компонента передавать данные кабинета, либо его id для запроса этих данных
        this.openedSheet = {
            Component: ClassroomSheet,
            props: { info },
        };
    };

    closeSheet = () => {
        this.openedSheet = null;
    };

    setCommonInfoState(state: boolean) {
        this.showCommonInfo = state;
    }

    setOverlay(type: OverlayType, props?: any) {
        this.overlay = {Component: overlayByType.get(type)!, props};
    }

    resetOverlay() {
        this.overlay = { Component: CommonOverlay };
    }
}

export const uiStore = new UIStore();
