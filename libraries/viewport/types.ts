import { Radians } from "~common";
import { ObjectMaterial, ObjectTransform } from "~scenes";

export type Color = [red: number, green: number, blue: number];
export type ViewportOptions = {
  backgroundColor: Color;
  depthTextureFormat: GPUTextureFormat;
  viewingAngle: Radians;
  safetyCropDistance: number;
  startingTransform?: ObjectTransform;
  missingMaterial: ObjectMaterial;
  missingTransform: ObjectTransform;
};
