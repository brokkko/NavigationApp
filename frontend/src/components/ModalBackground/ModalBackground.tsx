import { createPortal } from "react-dom";
import css from "./ModalBackground.module.css";

export default function ModalBackground({ onClick }: { onClick: () => void }) {
    return (
        <>
            {createPortal(
                <div onClick={onClick} className={css.Overlay} />,
                document.body
            )}
        </>
    );
}
