import { useTranslation } from 'next-i18next';
import css from './Splash.module.css'
import {ReactComponent as Logo} from './logo.svg';
import classNames from "classnames";

export function Splash({isFading}: {isFading: boolean}) {
    const {t} = useTranslation();
    return <div className={classNames(css.Wrapper, isFading && css.fade)}>
        <div className={css.logoSection}>
            <Logo className={css.logo} />
            <h1 className={css.client}>{t("Splash.etu")}</h1>
        </div>
        <div className={css.footer}>
            <h3 className={css.description}>{t("Splash.appDescription")}</h3>
        </div>
    </div>
}
