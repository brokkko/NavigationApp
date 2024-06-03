import wc from "../../../public/markers/wc.svg";
import elevator from "../../../public/markers/elevator.svg";
import stairs from "../../../public/markers/stairs.svg";
import exit from "../../../public/markers/exit.svg";
import info from "../../../public/markers/info.svg";
import { NavigationalTileType } from "./NavigationalTileType";

export enum MarkerType {
  ROOM,
  WC,
  ELEVATOR,
  STAIRS,
  EXIT,
  INFO,
}

export function getMarkerSVG(type: NavigationalTileType) {
  switch (type) {
    case NavigationalTileType.WC:
      return wc;
    case NavigationalTileType.ELEVATORS:
      return elevator;
    case NavigationalTileType.STAIRS:
      return stairs;
    case NavigationalTileType.ENTRANCE:
      return exit;
    case NavigationalTileType.INFO:
      return info;
    default:
      return "";
  }
}
