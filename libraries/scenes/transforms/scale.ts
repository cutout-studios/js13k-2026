import { Transform } from "./types.ts";

export const scale = (transform: Transform, scalar: number) =>
  transform.map((column) => column.map((value) => value * scalar)) as Transform;
