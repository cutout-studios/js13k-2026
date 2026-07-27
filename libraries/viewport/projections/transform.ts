import type { ObjectTransform } from "~scenes";

import type { Projection } from "./types.ts";
import { IS_PROJECTION_DIRECTION, IS_PROJECTION_POINT } from "./constants.ts";

export const fromTransform = (
  [xAxis, yAxis, zAxis, origin]: ObjectTransform,
): Projection =>
  new Float32Array([
    ...xAxis,
    IS_PROJECTION_DIRECTION,
    ...yAxis,
    IS_PROJECTION_DIRECTION,
    ...zAxis,
    IS_PROJECTION_DIRECTION,
    ...origin,
    IS_PROJECTION_POINT,
  ]);

export const toTransform = (
  [xx, xy, xz, _, yx, yy, yz, __, zx, zy, zz, ___, ox, oy, oz]: Projection,
): ObjectTransform => [
  [xx, xy, xz],
  [yx, yy, yz],
  [zx, zy, zz],
  [ox, oy, oz],
];
