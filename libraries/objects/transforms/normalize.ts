import { XYZ } from "~common";

export const normalize = (vector: XYZ): XYZ => {
  const magnitude = Math.sqrt(
    vector.reduce((sum, direction) => sum + direction ** 2, 0),
  );

  return vector.map((value) => value / magnitude) as XYZ;
};
