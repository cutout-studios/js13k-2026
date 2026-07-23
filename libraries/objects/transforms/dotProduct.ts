import { XYZ } from "~common";

export const dotProduct = (left: XYZ, right: XYZ) =>
  left.reduce(
    (result, value, index) => result + value * right[index],
    0,
  );
