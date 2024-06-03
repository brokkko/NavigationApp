import IconButton, { IconButtonProps } from "@/components/IconButton/IconButton";
import {useTranslation} from "next-i18next";
import css from './Other.module.css';

export function Other() {
    const {t} = useTranslation();
    const others: IconButtonProps[] = [
        {
            icon: "exit",
            title: t("RouteSheet.exit"),
            onClick: () => console.log(""),
        },
        {
            icon: "buffet",
            title: t("RouteSheet.buffet"),
            onClick: () => console.log(""),
        },
        {
            icon: "director",
            title: t("RouteSheet.directorate"),
            onClick: () => console.log(""),
        },
        {
            icon: "department",
            title: t("RouteSheet.department"),
            onClick: () => console.log(""),
        },
        {
            icon: "cloakroom",
            title: t("RouteSheet.cloakroom"),
            onClick: () => console.log(""),
        },
        {
            icon: "cafeteria",
            title: t("RouteSheet.cafeteria"),
            onClick: () => console.log(""),
        },
        {
            icon: "atm",
            title: t("RouteSheet.atm"),
            onClick: () => console.log(""),
        },
        {
            icon: "wcM",
            title: t("RouteSheet.wcMale"),
            onClick: () => console.log(""),
        },
        {
            icon: "wcF",
            title: t("RouteSheet.wcFemale"),
            onClick: () => console.log(""),
        },
        {
            icon: "stairs",
            title: t("RouteSheet.exit"),
            onClick: () => console.log(""),
        },
    ];
    return (
        <div>
            <h2 className={css.title}>{t("RouteSheet.other")}</h2>
            <div className={css.other}>
                {others.map((el, ind) => (
                    <IconButton key={`others_${ind}`} {...el} />
                ))}
            </div>
        </div>
    );
}
