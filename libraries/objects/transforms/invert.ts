import { doTimes, Transform, type XYZW } from "~common";
import { getColumn, getRow } from "./getters.ts";
import { dotProduct } from "./dotProduct.ts";
import { ORIGIN_COLUMN_INDEX, XYZ_WIDTH } from "./constants.ts";

// TODO: is there a better way to clamp this? actual inversion formula?
// NOTE: translation/rotation only
export const invert = (transform: Transform): Transform => {
  const origin = getColumn(transform, ORIGIN_COLUMN_INDEX);
  const columns = doTimes(XYZ_WIDTH, (index) => [
    ...getRow(transform, index).slice(0, XYZ_WIDTH),
    0,
  ]);
  columns.push([
    ...doTimes(
      XYZ_WIDTH,
      (index) => -dotProduct(getColumn(transform, index), origin),
    ),
    1,
  ] as XYZW);
  return new Float32Array(columns.flat());
};
