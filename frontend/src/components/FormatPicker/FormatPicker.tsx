import { supportedLanguages } from "@/const/languages";
import classNames from "classnames";
import { useState } from "react";
import css from "./FormatPicker.module.css";
import Icon from "../Icon/Icon";
import ModalBackground from "../ModalBackground/ModalBackground";
import { useRouter } from "next/router";
import {supportedFormats} from "@/const/formats";
import BottomPanel from "@/components/BottomPanel/BottomPanel";
import {useTranslation} from "next-i18next";
import {MapFormat, mapStore} from "@/stores/map";

export default function FormatPicker() {
    const [showFormats, setShownFormats] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();
    const setFormat = (lang: string) => {
        mapStore.setMapFormat(lang as MapFormat);
        setShownFormats(false);
    }
    return (
        <div>
            <button
                className={classNames(
                    css.languageButton,
                    showFormats && css.active
                )}
                onClick={() => setShownFormats(!showFormats)}
            >
                <div className={classNames(css.textIcon)}>
                    {mapStore.format?.toUpperCase().split("").reverse().join("")}
                </div>
                <div className={css.title}>{t("BottomPanel.format")}</div>
            </button>
            {showFormats && (
                <>
                    <ModalBackground onClick={() => setShownFormats(false)} />
                    <ul
                        onBlur={() => setShownFormats(false)}
                        className={css.languageList}
                    >
                        {supportedFormats.map((el) => (
                            <li
                                className={css.languageItem}
                                key={`format_${el.prefix}`}
                                onClick={() => setFormat(el.prefix)}
                            >
                                <p className={css.languageName}>{el.full} {t("BottomPanel.map")}</p>
                                {mapStore.format === el.prefix ? <Icon type="checkmark" /> : <div/>}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
