import { SheetType, uiStore } from "@/stores/ui";
import Icon from "../Icon/Icon";
import { LocationPicker } from "../LocationPicker/LocationPicker";
import css from "./Overlay.module.css";
import { PointType } from "@/types/points";

export default function SelectionOverlay(props: { type: PointType }) {
    console.log("SelectionOverlay")
    return (
        <div className={css.SelectionWrapper}>
            <Icon type="selector" className={css.selector} />
            <button
                className={css.returnButton}
                onClick={() => {
                    uiStore.openGenericSheet(SheetType.ROUTE);
                    uiStore.resetOverlay();
                }}
            >
                <Icon type="return" className={css.icon} />
            </button>
            <LocationPicker {...props} />
        </div>
    );
}
