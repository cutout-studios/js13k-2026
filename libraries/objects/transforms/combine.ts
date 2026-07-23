import { Transform } from "./types.ts";

export const combine = (...transforms: Transform[]) =>
  transforms.reduce((left, right) =>
    left.map((value, index) => value + right[index])
  );
