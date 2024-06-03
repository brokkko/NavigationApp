import { useTranslation } from "next-i18next";
import css from "./TopPanel.module.css";
import Icon from "../Icon/Icon";
import LanguagePicker from "../LanguagePicker/LanguagePicker";
import { SheetType, uiStore } from "@/stores/ui";
import { useRef } from "react";

export default function TopPanel() {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={css.Wrapper}>
            <div className={css.content}>
                <button>
                    <Icon type="search" />
                </button>
                <input
                    ref={inputRef}
                    className={css.search}
                    type="text"
                    onClick={(e) => {
                        uiStore.openGenericSheet(SheetType.ROUTE);
                        inputRef.current?.blur();
                    }}
                    placeholder={t("TopPanel.searchFor")}
                />
            </div>
        </div>
    );
}
