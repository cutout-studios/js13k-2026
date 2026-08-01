export type Radians = number;
export type XYZ = [x: number, y: number, z: number];

export const SECONDS_TO_MS = 1000;
export const MINUTES_TO_SECONDS = 60;
export const DIMENSIONS = 3;

export const BYTES_TO_BIN = 8;
export const FLOAT_32_BIN = 32;
export const FLOAT_32_BYTES = FLOAT_32_BIN / BYTES_TO_BIN;

export const repeat = <T>(times: number, thing: T): T[] =>
  Array(times).fill(thing);

export const doTimes = <T>(count: number, action: (count: number) => T): T[] =>
  repeat(count, null).map((_, index) => action(index));

export const dotProduct = <T extends number[]>(left: T, right: T) =>
  left.reduce(
    (result, value, index) => result + value * right[index],
    0,
  );

export const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const between = <T>(target: T, min: T, max: T) =>
  min <= target && target <= max;
