import { TRANSFORM_WIDTH } from "./constants.ts";
import { createTransform } from "./create.ts";
import { getColumn } from "./getters.ts";
import { doTimes, type XYZ } from "~common";
import { Transform, TransformCreationArguments } from "./types.ts";

export const setColumn = (
  transform: Transform,
  column: XYZ,
  setIndex: number,
): Transform =>
  createTransform(
    ...(doTimes(TRANSFORM_WIDTH, (index) =>
      index === setIndex
        ? getColumn(transform, index)
        : column) as TransformCreationArguments),
  );
