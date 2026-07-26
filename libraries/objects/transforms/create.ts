import { doTimes, type Transform, type XYZ } from "~common";
import {
  DEFAULT_ORIGIN,
  DEFAULT_Y_AXIS,
  IS_AXIS,
  IS_POINT,
} from "./constants.ts";
import { crossProduct } from "./crossProduct.ts";
import { getDefault } from "./getters.ts";
import { normalize } from "./normalize.ts";
import { setColumn } from "./setters.ts";
import {
  DEFAULT_PERSPECTIVE_SAFETY_CROP,
  ORIGIN_COLUMN_INDEX,
  XYZ_WIDTH,
} from "./constants.ts";

// TODO: this should probably take xyzw?
export const createTransform = (
  xAxis: XYZ,
  yAxis: XYZ,
  zAxis: XYZ,
  origin: XYZ,
): Transform =>
  new Float32Array([
    ...xAxis,
    IS_AXIS,
    ...yAxis,
    IS_AXIS,
    ...zAxis,
    IS_AXIS,
    ...origin,
    IS_POINT,
  ]);

export const createTranslation = (to: XYZ): Transform =>
  setColumn(getDefault(), to, ORIGIN_COLUMN_INDEX);

export const createRotation = (around: XYZ, amount: number): Transform => {
  const normalizedAxis = normalize(around);
  const [sin, cos] = [Math.sin(amount), Math.cos(amount)];

  return createTransform(
    ...(doTimes(XYZ_WIDTH, (columnIndex) =>
      doTimes(XYZ_WIDTH, (rowIndex) => {
        let cell = normalizedAxis[columnIndex] * normalizedAxis[rowIndex] *
          (1 - cos);

        if (columnIndex === rowIndex) {
          cell += cos;
        } else {
          const leftoverIndex = XYZ_WIDTH - columnIndex - rowIndex;
          const sign = (rowIndex + 1) % XYZ_WIDTH === columnIndex ? -1 : 1;
          cell += sin * normalizedAxis[leftoverIndex] * sign;
        }

        return cell;
      })) as [x: XYZ, y: XYZ, z: XYZ]),
    DEFAULT_ORIGIN,
  );
};

export const createOrientation = (direction: XYZ): Transform => {
  const z = normalize(direction);
  const x = normalize(crossProduct(DEFAULT_Y_AXIS, z));
  const y = crossProduct(z, x);

  return createTransform(x, y, z, DEFAULT_ORIGIN);
};

export const createPerspective = (
  aspectRatio: number,
  viewingAngle: number,
  safetyCrop = DEFAULT_PERSPECTIVE_SAFETY_CROP,
): Transform => {
  const viewportHeight = Math.tan(Math.PI / 2 - viewingAngle / 2);

  // TODO: spell this out
  // deno-fmt-ignore
  return new Float32Array([
    viewportHeight / aspectRatio, 0, 0, 0,
    0, viewportHeight, 0, 0,
    0, 0, -1, -1,
    0, 0, -2 * safetyCrop, 0
  ]);
};
