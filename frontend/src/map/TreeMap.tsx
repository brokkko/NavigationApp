import {threeJsMapViewModel} from "@/map/models/ThreeJsMapViewModel";
import {useEffect, useRef} from "react";

export default function TreeMap () {
    const refContainer: any = useRef(null);
    useEffect(() => {
        if (refContainer.current) {
            threeJsMapViewModel.initialize(refContainer.current)
        } else {
            console.error("Fail to initialize scene - no refContainer.current");
        }

    }, []);
    return (
        <div ref={refContainer}></div>
    );
}
