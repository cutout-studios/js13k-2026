import { cos, F32, sin } from "~alias";

import type { XYZ } from "./types.ts";
import { COORDINATE_SIDE_LENGTH } from "./constants.ts";

import { normalize } from "./xyz.ts";

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
  const [x, y, z] = normalize(axis);
  const s = sin(angle), c = cos(angle), versine = 1 - c;
  const vx = versine * x, vy = versine * y, vz = versine * z;
  const sx = s * x, sy = s * y, sz = s * z;

  // deno-fmt-ignore
  return new F32([
    vx * x + c,  vx * y + sz, vx * z - sy, 0,
    vx * y - sz, vy * y + c,  vy * z + sx, 0,
    vx * z + sy, vy * z - sx, vz * z + c,  0,
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
