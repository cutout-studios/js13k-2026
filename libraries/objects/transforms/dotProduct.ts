import type { XYZW } from "~common";

export const dotProduct = (left: XYZW, right: XYZW) =>
  left.reduce(
    (result, value, index) => result + value * right[index],
    0,
  );
