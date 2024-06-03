import { useTranslation } from "next-i18next";
import css from "./CommonInfo.module.css";
import { createPortal } from "react-dom";
import Icon from "../Icon/Icon";
import { uiStore } from "@/stores/ui";

export default function CommonInfo() {
    const { t } = useTranslation();
    return createPortal(
        <div className={css.Wrapper}>
            <div className={css.header}>
                <img src="./etu/uniLogo.svg" className={css.logo} />
                <h2 className={css.name}>{t("CommonInfo.name")}</h2>
                <Icon type="cross" onClick={() => uiStore.setCommonInfoState(false)} className={css.close}/>
            </div>
            <div className={css.about}>
                <p className={css.description}>{t("CommonInfo.description")}</p>
                <img className={css.picture} src="./etu/uniPhoto.svg" />
            </div>
            <div className={css.contactsBlock}>
                <h3 className={css.contacts}>{t("CommonInfo.contacts")}</h3>
                <div className={css.contact}>
                    {t("CommonInfo.website")}:{" "}
                    <a href="https://uni.ru" className={css.link}>
                        https://uni.ru
                    </a>
                </div>
                <div className={css.contact}>
                    {t("CommonInfo.reception")}:{" "}
                    <a href="tel:333333333" className={css.link}>
                        333 333-33-33
                    </a>
                </div>
                <div className={css.contact}>
                    {t("CommonInfo.inquiries")}:{" "}
                    <a href="mailto:info@uni.ru" className={css.link}>
                        info@uni.ru
                    </a>
                </div>
                <div className={css.contact}>
                    {t("CommonInfo.publicRelations")}:{" "}
                    <a href="mailto:oso@uni.ru" className={css.link}>
                        oso@uni.ru
                    </a>
                </div>
            </div>
        </div>,
        document.body
    );
}
