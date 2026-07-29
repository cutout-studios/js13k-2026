import { Radians } from "~common";
import { ObjectMaterial } from "~objects";
import { RigidTransform } from "~transforms";

export type Color = [red: number, green: number, blue: number];
export type ViewportOptions = {
  backgroundColor: Color;
  depthTextureFormat: GPUTextureFormat;
  viewingAngle: Radians;
  safetyCropDistance: number;
  startingTransform?: RigidTransform;
  missingMaterial: ObjectMaterial;
  missingTransform: RigidTransform;
};
