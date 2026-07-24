import { doTimes, Transform, type XYZ } from "~common";
import { createTransform } from "./create.ts";
import { getColumn, getRow } from "./getters.ts";
import { dotProduct } from "./dotProduct.ts";
import { ORIGIN_COLUMN_INDEX, XYZ_WIDTH } from "./constants.ts";

// NOTE: translation/rotation only
export const invert = (transform: Transform): Transform => {
  const origin = getColumn(transform, ORIGIN_COLUMN_INDEX);
  const columns = doTimes(XYZ_WIDTH, (index) => getRow(transform, index));

  columns.push(
    doTimes(
      XYZ_WIDTH,
      (index) => -dotProduct(getColumn(transform, index), origin),
    ) as XYZ,
  );

  return createTransform(
    ...(columns as [xAxs: XYZ, yAxis: XYZ, zAxis: XYZ, origin: XYZ]),
  );
};
