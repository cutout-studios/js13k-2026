export type XYZ = [x: number, y: number, z: number];

export const doTimes = <T>(count: number, action: (count: number) => T): T[] =>
  Array(count).fill(null).map((_, index) => action(index));
