import css from "./FloorSwitch.module.css";
import classNames from "classnames";
import {mapStore} from "@/stores/map";
import {observer} from "mobx-react-lite";

export const FloorSwitch = observer(function floorSwitch() {
    const selectFloor = (floor: number) => {
        mapStore.setFloor(floor)
    }

    return (
        <div className={css.Wrapper}>
            {[...mapStore.existingFloors].reverse().map((el) => (
                <div
                    className={classNames(
                        css.floor,
                        mapStore.floor === el && css.selected
                    )}
                    key={`floor_${el}`}
                    onClick={() => selectFloor(el)}
                >
                    {el}
                </div>
            ))}
        </div>
    );
})
