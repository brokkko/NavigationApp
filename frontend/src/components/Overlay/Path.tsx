import { useTranslation } from "next-i18next";
import css from "./Overlay.module.css";
import Icon from "../Icon/Icon";
import { uiStore } from "@/stores/ui";
import {threeJsMapViewModel} from "@/map/models/ThreeJsMapViewModel";

export default function PathOverlay() {
    const { t } = useTranslation();
    // TODO real route time
    const time = 124;

    function formatPathtime(timeInSeconds: number) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        let finalString = "";
        if (minutes > 0) {
            finalString += t("PathOverlay.minutes", { count: minutes }) + " ";
        }
        if (seconds > 0) {
            finalString += t("PathOverlay.seconds", { count: seconds });
        }
        return finalString;
    }

    return (
        <div className={css.PathWrapper}>
            <div className={css.pathContent}>
                <div>
                    {t("PathOverlay.pathTime")}{" "}
                    <span className={css.time}>{formatPathtime(time)}</span>
                </div>
                <Icon
                    type="cross"
                    className={css.iconBig}
                    onClick={() => {
                        uiStore.resetOverlay();
                        threeJsMapViewModel.clearPath();
                    }}
                />
            </div>
        </div>
    );
}
