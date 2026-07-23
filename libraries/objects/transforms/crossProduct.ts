import { doTimes, type XYZ } from "~common";
import { XYZ_WIDTH } from "./constants.ts";

export const crossProduct = (left: XYZ, right: XYZ): XYZ =>
  doTimes(XYZ_WIDTH, (index) => {
    const [first, second] = doTimes(
      XYZ_WIDTH - 1,
      (offset) => (index + offset + 1) % XYZ_WIDTH,
    );

    return left[first] * right[second] - left[second] * right[first];
  }) as XYZ;
