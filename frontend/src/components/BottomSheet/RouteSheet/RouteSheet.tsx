import { useTranslation } from "next-i18next";
import css from "./RouteSheet.module.css";
import { useState } from "react";
import { SearchHistory } from "./SearchHistory/SearchHistory";
import { Other } from "./Other/Other";
import { Search } from "./Search/Search";
import { OverlayType, uiStore } from "@/stores/ui";
import { observer } from "mobx-react-lite";
import { mapStore } from "@/stores/map";
import { PointData, PointType } from "@/types/points";
import {threeJsMapViewModel} from "@/map/models/ThreeJsMapViewModel";
import {mapService} from "@/map/services/MapService";

function RouteSheet() {
    const { t } = useTranslation();

    const { pathEnd, pathStart, currentLocation, setPathPoint } = mapStore;
    const [searchOptions, setSearchOptions] = useState<null | PointType>(null);
    const showPath = () => {
        console.log(pathStart, pathEnd)
        threeJsMapViewModel.setPath(mapService.getById(111), mapService.getById(215));
        uiStore.setOverlay(OverlayType.PATH);
        uiStore.closeSheet();
    };

    // TODO: ask for location selection if isn't selected
    const setCurrentLocation = () => {
        if (currentLocation) {
            setSpecificLocation(currentLocation);
        }
    };

    const setSpecificLocation = (location: PointData) => {
        if (searchOptions) {
            setPathPoint(searchOptions, location);
        }
    };

    return (
        <div className={css.Wrapper}>
            <div className={css.content}>
                <Search
                    startPoint={pathStart}
                    setPoint={setPathPoint}
                    endPoint={pathEnd}
                    searchOptions={searchOptions}
                    setSearchOptions={setSearchOptions}
                    // @ts-ignore
                    setCurrentLocation={setCurrentLocation}
                />
                <SearchHistory setLocation={setSpecificLocation} />
            </div>
            <button
                className={css.button}
                disabled={!pathStart || !pathEnd}
                onClick={showPath}
            >
                {t("RouteSheet.buildRoute")}
            </button>
        </div>
    );
}

export default observer(RouteSheet);
