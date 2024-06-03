import InfoField from "@/components/InfoField/InfoField";
import { useTranslation } from "next-i18next";
import css from "./ClassroomSheet.module.css";
import { uiStore } from "@/stores/ui";
import {database, RoomModel, RoomType} from "@/mocks/database";

export default function ClassroomSheet({ info }: { info: RoomModel }) {
    const { t } = useTranslation();
    return (
        <div className={css.Wrapper}>
            <div className={css.roomInfo}>
                {
                    info.type === RoomType.CLASSROOM
                        ?  <h2 className={css.title}>
                            {t(`ClassroomSheet.${info.type.toLowerCase()}`, {
                                ...info,
                            })}
                        </h2>
                        :  <h2 className={css.title}>{info.number}</h2>
                }
                <div className={css.about}>
                    <InfoField
                        name={t("ClassroomSheet.building")}
                        info={info.building}
                />
                    <InfoField
                        name={t("ClassroomSheet.floor")}
                        info={info.floor}
                    />
                    <InfoField
                        name={t("ClassroomSheet.extra")}
                        info={
                            info.stuff === null
                                ? info.stuff
                                : info.stuff.map((el) =>
                                      t(`ClassroomSheet.${el}`)
                                  )
                        }
                    />
                </div>
            </div>
            <div className={css.sheetFooter}>
                <button
                    onClick={() => {
                        console.log("build route");
                        uiStore.closeSheet();
                    }}
                    className={css.button}
                >
                    {t("ClassroomSheet.goThere")}
                </button>
            </div>
        </div>
    );
}
