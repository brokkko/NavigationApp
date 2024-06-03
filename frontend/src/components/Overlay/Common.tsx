import BottomPanel from "../BottomPanel/BottomPanel";
import { FloorSwitch } from "../FloorSwitch/FloorSwitch";
import TopPanel from "../TopPanel/TopPanel";

export default function CommonOverlay() {
    return (
        <>
            <TopPanel />
            <FloorSwitch />
            <BottomPanel />
        </>
    );
}
