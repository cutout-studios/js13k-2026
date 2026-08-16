import { F32, hypot } from "~alias";

import type { XYZ } from "./types.ts";
import { COORDINATE_SIDE_LENGTH } from "./constants.ts";

export const createCoordinates = (
  xAxis: XYZ = [1, 0, 0],
  yAxis: XYZ = [0, 1, 0],
  zAxis: XYZ = [0, 0, 1],
  origin: XYZ = [0, 0, 0],
) =>
  /** w = 0 for an axis, 1 for a point */
  new F32([...xAxis, 0, ...yAxis, 0, ...zAxis, 0, ...origin, 1]);

export const createRotation = (
  [axis, angle]: [XYZ, number] = [[1, 0, 0], 0],
) => {
  const magnitude = hypot(...axis) || 1;
  const [x, y, z] = axis.map((value) => value / magnitude);
  const sin = Math.sin(angle), cos = Math.cos(angle), versine = 1 - cos;
  const vx = versine * x, vy = versine * y, vz = versine * z;
  const sx = sin * x, sy = sin * y, sz = sin * z;

  // deno-fmt-ignore
  return new F32([
    vx * x + cos, vx * y + sz, vx * z - sy, 0,
    vx * y - sz,  vy * y + cos, vy * z + sx, 0,
    vx * z + sy,  vy * z - sx,  vz * z + cos, 0,
    0, 0, 0, 1,
  ]);
};

const lengthMinusOne = COORDINATE_SIDE_LENGTH - 1;
export const localize = (fromChild: Float32Array, toParent: Float32Array) => {
  const result = new F32(COORDINATE_SIDE_LENGTH ** 2);

  let index = COORDINATE_SIDE_LENGTH ** lengthMinusOne;

  // Yeah... bit math...
  while (index--) {
    result[index >> 2] += fromChild[
      (index >> COORDINATE_SIDE_LENGTH << 2) + (index & lengthMinusOne)
    ] *
      toParent[
        (index & lengthMinusOne) * COORDINATE_SIDE_LENGTH +
        (index >> 2 & lengthMinusOne)
      ];
  }

  return result;
};

export const readOrigin = (coordinates: Float32Array): XYZ =>
  [...coordinates.subarray(12, 15)] as XYZ;
