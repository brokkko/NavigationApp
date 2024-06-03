import css from "./InfoField.module.css";

export default function InfoField({
    name,
    info,
}: {
    name: string;
    info: string[] | string | number | null;
}) {
    return (
        <div className={css.Wrapper}>
            <p className={css.name}>{name}</p>
            <p className={css.info}>
                {info !== null
                    ? Array.isArray(info)
                        ? info.join(", ")
                        : info
                    : "-"}
            </p>
        </div>
    );
}
