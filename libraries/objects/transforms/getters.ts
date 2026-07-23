import { doTimes, type XYZ } from "~common";
import {
  DEFAULT_ORIGIN,
  DEFAULT_X_AXIS,
  DEFAULT_Y_AXIS,
  DEFAULT_Z_AXIS,
  TRANSFORM_WIDTH,
  XYZ_WIDTH,
} from "./constants.ts";
import { createTransform } from "./create.ts";
import { Transform } from "./types.ts";

export const getDefault = () =>
  createTransform(
    DEFAULT_X_AXIS,
    DEFAULT_Y_AXIS,
    DEFAULT_Z_AXIS,
    DEFAULT_ORIGIN,
  );

export const getColumn = (transform: Transform, index: number): XYZ =>
  [...transform.slice(index * XYZ_WIDTH, (index + 1) * XYZ_WIDTH)] as XYZ;

export const getRow = (
  transform: Transform,
  index: number,
): XYZ =>
  doTimes(
    XYZ_WIDTH,
    (columnIndex) => transform[index + TRANSFORM_WIDTH * columnIndex],
  ) as XYZ;
