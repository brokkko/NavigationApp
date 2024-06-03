import { useTranslation } from "next-i18next";
import css from "./LocationPicker.module.css";
import { SheetType, uiStore } from "@/stores/ui";
import { mapStore } from "@/stores/map";
import { PointType, PointData } from "@/types/points";
import {threeJsMapViewModel} from "@/map/models/ThreeJsMapViewModel";
import {RoomModel} from "@/mocks/database";

export function LocationPicker({type}:{type: PointType}) {
    const { t } = useTranslation();
    // TODO get marker location
    let markerLocation: null | PointData =
        { id: 666, name: "", isCurrentLocation: false };
    return (
        <div className={css.Wrapper}>
            <div className={css.instruction}>
                {t("LocationPicker.instruction")}
            </div>
            <div className={css.locationName}>
                {markerLocation !== null
                    ? ""
                    : t("LocationPicker.detectionError")}
            </div>
            <button
                className={css.readyButton}
                // disabled={markerLocation === null}
                onClick={() => {
                    // TODO: 1) getLocation from ThreeJsMapView 2) mapStore set 3) open route set page
                    // if no location, marker location set null
                    let obj:RoomModel | null = threeJsMapViewModel.getCurrentRoom();
                    if (obj !== null) {
                        markerLocation = {id: obj.id, name: obj.number, isCurrentLocation: false};
                        mapStore.setPathPoint(type, markerLocation)
                        uiStore.openGenericSheet(SheetType.ROUTE);
                        uiStore.resetOverlay();
                    } else {
                        markerLocation = null;

                    }
                }}
            >
                {t("LocationPicker.ready")}
            </button>
        </div>
    );
}
