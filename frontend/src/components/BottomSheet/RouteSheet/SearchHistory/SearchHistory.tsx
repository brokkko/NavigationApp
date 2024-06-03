import { useTranslation } from "next-i18next";
import Icon from "@/components/Icon/Icon";
import css from "./SearchHistory.module.css";
import { PointData } from "@/types/points";
import { useEffect, useState } from "react";
import { HistoryItem } from "@/types/history";

export function SearchHistory({
    setLocation,
}: {
    setLocation: (point: PointData) => void;
}) {
    const { t } = useTranslation();

    const [history, setHistory] = useState<HistoryItem[] | null>(null);

    useEffect(() => {
        const getHistory = () => {
            const localHistory = window.localStorage.getItem("history");
            if (localHistory) {
                setHistory(JSON.parse(localHistory));
            }
        };
        getHistory();
        window.addEventListener("storage", getHistory);

        return () => {
            window.removeEventListener("storage", getHistory);
        };
    }, []);

    return (
        <div>
            <h2 className={css.title}>{t("RouteSheet.history")}</h2>
            <div>
                {history === null ? (
                    <div className={css.historyPlaceholder}>
                        {t("RouteSheet.noHistory")}
                    </div>
                ) : (
                    history.map((el) => (
                        <div
                            className={css.historyItem}
                            key={`history_${el.id}`}
                            onMouseDown={() =>
                                setLocation({
                                    ...el,
                                    isCurrentLocation: false,
                                })
                            }
                        >
                            <Icon type="clock" />
                            <div className={css.historyData}>
                                <h3 className={css.historyName}>{el.name}</h3>
                                <p className={css.placement}>
                                    {t("RouteSheet.placement", { ...el })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
