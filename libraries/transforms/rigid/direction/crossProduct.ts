import { DIMENSIONS, doTimes } from "~common";

import type { Direction } from "../types.ts";

export const crossProduct = (left: Direction, right: Direction): Direction =>
  doTimes(DIMENSIONS, (index) => {
    const [first, second] = doTimes(
      DIMENSIONS - 1,
      (offset) => (index + offset + 1) % DIMENSIONS,
    );

    return left[first] * right[second] - left[second] * right[first];
  }) as Direction;
