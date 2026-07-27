import type { Point } from "../geometry/types.ts";

export type Transform = [...Directions, origin: Origin];
export type Directions = [
  xDirection: Direction,
  yDirection: Direction,
  zDirection: Direction,
];
export type Direction = [x: number, y: number, z: number];
export type Origin = Point;
