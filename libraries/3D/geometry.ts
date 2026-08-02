import type { XOGeometry, XYZ } from "./types.ts";

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
