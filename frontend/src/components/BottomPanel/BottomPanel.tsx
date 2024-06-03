import { useTranslation } from "next-i18next";
import IconButton from "../IconButton/IconButton";
import css from "./BottomPanel.module.css";
import { SheetType, uiStore } from "@/stores/ui";
import LanguagePicker from "@/components/LanguagePicker/LanguagePicker";
import FormatPicker from "@/components/FormatPicker/FormatPicker";

export default function BottomPanel() {
    const { t } = useTranslation();
    return (
        <div className={css.Wrapper}>
            <FormatPicker/>
            <LanguagePicker />
            <IconButton
                icon="route"
                title={t("BottomPanel.route")}
                onClick={() => uiStore.openGenericSheet(SheetType.ROUTE)}
            />
            <IconButton
                icon="info"
                title={t("BottomPanel.aboutUs")}
                onClick={() =>  uiStore.setCommonInfoState(true)}
            />
        </div>
    );
}
