import Icon, { IconType } from "../Icon/Icon";
import css from './IconButton.module.css'

export type IconButtonProps = {
    icon: IconType;
    title: string;
    onClick: () => void;
};

export default function IconButton({ icon, title, onClick }: IconButtonProps) {
    return (
        <button onClick={onClick} className={css.Wrapper}>
            <div className={css.svgWrapper}>
                <Icon type={icon} />
            </div>
            <div className={css.title}>{title}</div>
        </button>
    );
}
