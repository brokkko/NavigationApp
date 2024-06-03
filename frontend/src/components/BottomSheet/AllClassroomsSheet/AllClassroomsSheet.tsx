import { mapStore } from "@/stores/map";
import { uiStore } from "@/stores/ui";
import css from "./AllClassroomsSheet.module.css";
import { LocationType } from "@/fetch/fetchLocationInfo";
import { useTranslation } from "next-i18next";
import {RoomType} from "@/mocks/database";

export default function AllClassroomsSheet() {
    const { locations } = mapStore;
    const { t } = useTranslation();

    return (
        <div className={css.Wrapper}>
            <h2 className={css.title}>{t("AllClassrooms.title")}</h2>
            <div className={css.roomsDisplay}>
                {locations.map((el) => (
                    <button
                        key={el.id}
                        onClick={() => uiStore.openClassroomSheet(el)}
                        className={css.roomButton}
                    >
                        {el.type === RoomType.CLASSROOM
                            ? el.number
                            : t(`ClassroomSheet.${el.type.toLowerCase()}`)}
                    </button>
                ))}
            </div>
        </div>
    );
}
