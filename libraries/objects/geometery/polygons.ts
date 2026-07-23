import type { XYZ } from "~common";

export const triangle = (p1: XYZ, p2: XYZ, p3: XYZ): XYZ[] => [p1, p2, p3];
// deno-fmt-ignore
export const quadrangle = (p1: XYZ, p2: XYZ, p3: XYZ, p4: XYZ): XYZ[] => 
  [...triangle(p1, p2, p3), ...triangle(p2, p3, p4)];
