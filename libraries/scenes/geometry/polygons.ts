import type { Geometry, Point } from "./types.ts";

export const triangle = (
  p1: Point,
  p2: Point,
  p3: Point,
): Geometry => [p1, p2, p3];
export const square = (
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
): Geometry => [...triangle(p1, p2, p3), ...triangle(p1, p3, p4)];
