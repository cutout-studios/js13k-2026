import { FLOAT_32_BIN, FLOAT_32_BYTES, XYZ, XYZ_LENGTH } from "~common";

export type XOGeometry = XYZ[];

export const POINT_SIZE = XYZ_LENGTH * FLOAT_32_BYTES;
export const POINT_FORMAT: GPUVertexFormat =
  `float${FLOAT_32_BIN}x${XYZ_LENGTH}`;

export const triangle = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
): XOGeometry => [p1, p2, p3];
export const square = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
  p4: XYZ,
): XOGeometry => [...triangle(p1, p2, p3), ...triangle(p1, p3, p4)];
