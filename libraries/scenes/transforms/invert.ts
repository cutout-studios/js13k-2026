import { DIMENSIONS, doTimes, dotProduct } from "~common";

import type { Directions, Origin, Transform } from "./types.ts";

export const invert = ([xAxis, yAxis, zAxis, origin]: Transform): Transform => [
  ...(doTimes(
    DIMENSIONS,
    (index) => [xAxis[index], yAxis[index], zAxis[index]],
  ) as Directions),
  [xAxis, yAxis, zAxis].map((axis) => -dotProduct(axis, origin)) as Origin,
];
