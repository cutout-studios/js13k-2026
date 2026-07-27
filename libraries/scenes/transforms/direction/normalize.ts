import type { Direction } from "../types.ts";

export const normalize = (Direction: Direction): Direction => {
  const magnitude = Math.sqrt(
    Direction.reduce((sum, direction) => sum + direction ** 2, 0),
  );

  return Direction.map((value) => value / magnitude) as Direction;
};
