import type { Direction, Origin, Transform } from "./types.ts";

export const DEFAULT_X_DIRECTION: Direction = [1, 0, 0];
export const DEFAULT_Y_DIRECTION: Direction = [0, 1, 0];
export const DEFAULT_Z_DIRECTION: Direction = [0, 0, 1];
export const DEFAULT_ORIGIN: Origin = [0, 0, 0];

export const DEFAULT_TRANSFORM: Transform = [
  DEFAULT_X_DIRECTION,
  DEFAULT_Y_DIRECTION,
  DEFAULT_Z_DIRECTION,
  DEFAULT_ORIGIN,
];
