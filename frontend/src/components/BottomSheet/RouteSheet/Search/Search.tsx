import { useTranslation } from "next-i18next";
import Icon from "@/components/Icon/Icon";
import css from "./Search.module.css";
import { OverlayType, SheetType, uiStore } from "@/stores/ui";
import { PointData, PointType } from "@/types/points";
import { HistoryItem } from "@/types/history";

export function Search({
    startPoint,
    setPoint,
    endPoint,
    searchOptions,
    setSearchOptions,
}: {
    startPoint: PointData | null;
    setPoint: (type: PointType, p: PointData | null) => void;
    endPoint: PointData | null;
    searchOptions: PointType | null;
    setSearchOptions: (p: PointType | null) => void;
}) {
    // TODO Search for point by name on backend & get result

    const { t } = useTranslation();

    const switchPoints = () => {
        const oldEnd = endPoint;
        setPoint(PointType.END, startPoint);
        setPoint(PointType.START, oldEnd);
    };

    const readFromMap = () => {
        uiStore.setOverlay(OverlayType.SLECTION, {
            type: searchOptions,
        });
        uiStore.closeSheet();
    };

    const blurSearch = (p: PointData | null) => {
        setSearchOptions(null);
        if (p) addToHistory(p);
    };

    const addToHistory = (p: PointData) => {
        let history = window.localStorage.getItem("history");
        let historyData: HistoryItem[];
        if (history) {
            historyData = (JSON.parse(history) as HistoryItem[]).slice(0, 2);
            historyData = [
                {
                    name: p.name,
                    id: p.id,
                    building: 5,
                    floor: 5,
                },
                ...historyData,
            ];
        } else {
            historyData = [
                {
                    name: p.name,
                    id: p.id,
                    building: 5,
                    floor: 5,
                },
            ];
        }
        window.localStorage.setItem("history", JSON.stringify(historyData));
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <>
            <div className={css.search}>
                <div className={css.fields}>
                    <div className={css.field}>
                        <Icon
                            type={
                                startPoint?.isCurrentLocation
                                    ? "locator"
                                    : "point"
                            }
                        />
                        <input
                            className={css.destinationSearch}
                            placeholder={t("RouteSheet.from")}
                            value={
                                startPoint?.isCurrentLocation
                                    ? t("RouteSheet.yourLocation")
                                    : startPoint?.name ?? ""
                            }
                            onChange={(e) =>
                                setPoint(PointType.START, {
                                    name: e.target.value,
                                    id: 777,
                                    isCurrentLocation: false,
                                })
                            }
                            onFocus={() => setSearchOptions(PointType.START)}
                            onBlur={() => blurSearch(startPoint)}
                        />
                        {startPoint !== null && (
                            <Icon
                                type="cross"
                                className={css.inputClear}
                                onClick={() => setPoint(PointType.START, null)}
                            />
                        )}
                    </div>
                    <div className={css.field}>
                        <Icon
                            type={
                                endPoint?.isCurrentLocation
                                    ? "locator"
                                    : "point"
                            }
                        />
                        <input
                            className={css.destinationSearch}
                            placeholder={t("RouteSheet.to")}
                            value={
                                endPoint?.isCurrentLocation
                                    ? t("RouteSheet.yourLocation")
                                    : endPoint?.name ?? ""
                            }
                            onChange={(e) =>
                                setPoint(PointType.END, {
                                    name: e.target.value,
                                    id: 777,
                                    isCurrentLocation: false,
                                })
                            }
                            onFocus={() => setSearchOptions(PointType.END)}
                            onBlur={() => blurSearch(endPoint)}
                        />
                        {endPoint !== null && (
                            <Icon
                                type="cross"
                                className={css.inputClear}
                                onClick={() => setPoint(PointType.END, null)}
                            />
                        )}
                    </div>
                </div>
                <Icon type="exchange" onClick={switchPoints} />
            </div>
            {searchOptions && (
                <div className={css.destinationOptions}>
                    <button className={css.option} onMouseDown={readFromMap}>
                        <Icon type="marker" />
                        <p className={css.optionName}>
                            {t("RouteSheet.selectOnMap")}
                        </p>
                    </button>
                </div>
            )}
        </>
    );
}
