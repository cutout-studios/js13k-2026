import { doTimes, type Transform, TRANSFORM_WIDTH, type XYZW } from "~common";
import {
  DEFAULT_ORIGIN,
  DEFAULT_X_AXIS,
  DEFAULT_Y_AXIS,
  DEFAULT_Z_AXIS,
} from "./constants.ts";
import { createTransform } from "./create.ts";

export const getDefault = () =>
  createTransform(
    DEFAULT_X_AXIS,
    DEFAULT_Y_AXIS,
    DEFAULT_Z_AXIS,
    DEFAULT_ORIGIN,
  );

export const getColumn = (transform: Transform, index: number): XYZW =>
  [...transform.slice(
    index * TRANSFORM_WIDTH,
    (index + 1) * TRANSFORM_WIDTH,
  )] as XYZW;

export const getRow = (
  transform: Transform,
  index: number,
): XYZW =>
  doTimes(
    TRANSFORM_WIDTH,
    (columnIndex) => transform[index + TRANSFORM_WIDTH * columnIndex],
  ) as XYZW;
