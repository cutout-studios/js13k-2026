import { copy, DIMENSIONS, doTimes, type Radians } from "~common";

import type { Point } from "../geometry/types.ts";

import {
  DEFAULT_ORIGIN,
  DEFAULT_X_DIRECTION,
  DEFAULT_Y_DIRECTION,
  DEFAULT_Z_DIRECTION,
} from "./constants.ts";
import type { Direction, Directions, Transform } from "./types.ts";

// import { crossProduct } from "./direction/crossProduct.ts";
import { normalize } from "./direction/normalize.ts";

export const createTranslation = (
  to: Point,
): Transform =>
  copy([DEFAULT_X_DIRECTION, DEFAULT_Y_DIRECTION, DEFAULT_Z_DIRECTION, to]);

export const createRotation = (
  around: Direction,
  amount: Radians,
): Transform => {
  const normalizedAxis = normalize(around);
  const [sin, cos] = [Math.sin(amount), Math.cos(amount)];

  return [
    ...(doTimes(DIMENSIONS, (columnIndex) =>
      doTimes(DIMENSIONS, (rowIndex) => {
        let cell = normalizedAxis[columnIndex] * normalizedAxis[rowIndex] *
          (1 - cos);

        if (columnIndex === rowIndex) {
          cell += cos;
        } else {
          const leftoverIndex = DIMENSIONS - columnIndex - rowIndex;
          const sign = (rowIndex + 1) % DIMENSIONS === columnIndex ? -1 : 1;
          cell += sin * normalizedAxis[leftoverIndex] * sign;
        }

        return cell;
      })) as Directions),
    copy(DEFAULT_ORIGIN),
  ];
};

// export const createOrientation = (direction: TransformDirection): Transform => {
//   const z = normalize(direction);
//   const x = normalize(crossProduct(DEFAULT_Y_AXIS, z));
//   const y = crossProduct(z, x);

//   return [x, y, z, DEFAULT_ORIGIN];
// };
