import { Radians } from "~common";
import { Projection } from "./projections/types.ts";
import { ObjectMaterial, ObjectTransform } from "~scenes";

export type Color = [red: number, green: number, blue: number];
export type ViewportOptions = {
  backgroundColor: Color;
  depthTextureFormat: GPUTextureFormat;
  viewingAngle: Radians;
  safetyCropDistance: number;
  startingProjection: Projection;
  missingMaterial: ObjectMaterial;
  missingTransform: ObjectTransform;
};
