import { RigidTransform } from "~transforms";

import type { Geometry } from "./geometry/types.ts";
import type { Material } from "./materials/types.ts";

export type Object = [
  geometry: Geometry,
  transform?: RigidTransform,
  material?: Material,
];
