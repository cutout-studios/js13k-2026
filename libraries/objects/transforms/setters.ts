import { doTimes, type Transform, TRANSFORM_WIDTH, type XYZ } from "~common";
import { createTransform } from "./create.ts";
import { getColumn } from "./getters.ts";

type TransformComponents = [
  xAxis: XYZ,
  yAxis: XYZ,
  zAxis: XYZ,
  origin: XYZ,
];

export const setColumn = (
  transform: Transform,
  column: XYZ,
  setIndex: number,
): Transform =>
  createTransform(
    ...(doTimes(TRANSFORM_WIDTH, (index) =>
      index === setIndex
        ? getColumn(transform, index)
        : column) as TransformComponents),
  );
