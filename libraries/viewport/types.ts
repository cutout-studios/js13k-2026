import { Radians } from "~common";
import { ObjectMaterial, Paint } from "~objects";
import { RigidTransform } from "~transforms";

export type ViewportOptions = {
  backgroundColor: Paint;
  viewingAngle: Radians;
  safetyCropDistance: number;
  startingTransform?: RigidTransform;
  missingMaterial: ObjectMaterial;
  missingTransform: RigidTransform;
};
