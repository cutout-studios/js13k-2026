
import { XOOrientation, XOGeometry } from "~/3D";
import { ActionSchedule } from "~/clock";

export type DataTypeOptions = [
  name: string,
  baseValue: number,
  itemTypesID: number,
  modifierTypeID: number,
  modifierMagnitudeID: number
];

export type ColorOptions = [
  name: string,
  value: number,
  enemy: [
    shape: [orientation: XOOrientation, geometry: XOGeometry][],
    schedule: ActionSchedule<Ship>,
  ],
  data: DataTypeOptions[],
];
