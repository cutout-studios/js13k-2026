import type { XYZ } from "~common";

export type Transform = Float32Array;

export type TransformCreationArguments = [
  xAxis: XYZ,
  yAxis: XYZ,
  zAxis: XYZ,
  origin: XYZ,
];
