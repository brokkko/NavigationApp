import { supportedLanguages } from "@/const/languages";
import classNames from "classnames";
import { useState } from "react";
import css from "./LanguagePicker.module.css";
import Icon from "../Icon/Icon";
import ModalBackground from "../ModalBackground/ModalBackground";
import { useRouter } from "next/router";
import {mapStore} from "@/stores/map";
import {useTranslation} from "next-i18next";

export default function LanguagePicker() {
    const [showLanguages, setShownLanguage] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();
    const setLanguage = (lang: string) => {
        document.cookie = `NEXT_LOCALE=${lang}`;
        setShownLanguage(false);
        router.push(router.pathname, router.asPath, {locale: lang})
    }
    return (
        <div>
            <button
                className={classNames(
                    css.languageButton,
                    showLanguages && css.active
                )}
                onClick={() => setShownLanguage(!showLanguages)}
            >
                <div className={classNames(css.textIcon)}>
                    {router.locale?.toUpperCase()}
                </div>
                <div className={css.title}>{t("BottomPanel.lang")}</div>
            </button>
            {showLanguages && (
                <>
                    <ModalBackground onClick={() => setShownLanguage(false)} />
                    <ul
                        onBlur={() => setShownLanguage(false)}
                        className={css.languageList}
                    >
                        {supportedLanguages.map((el) => (
                            <li
                                className={css.languageItem}
                                key={`language_${el.prefix}`}
                                onClick={() => setLanguage(el.prefix)}
                            >
                                <p className={css.languageName}>{el.full}</p>
                                {router.locale === el.prefix ? <Icon type="checkmark" /> : <div/>}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
