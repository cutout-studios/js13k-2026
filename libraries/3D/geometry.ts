import type { XOGeometry, XYZ } from "./types.ts";

export const makeTriangle = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
): XOGeometry => [p1, p2, p3];

export const makeSquare = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
  p4: XYZ,
): XOGeometry => [...makeTriangle(p1, p2, p3), ...makeTriangle(p1, p3, p4)];
