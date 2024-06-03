import icons from "./icons";

export type IconType = keyof typeof icons;

export default function Icon({ type, onClick, className }: { type: IconType, onClick?: () => void, className?: string }): JSX.Element {
    const Icon = icons[type];
    return <Icon onClick={onClick} className={className} />;
}
