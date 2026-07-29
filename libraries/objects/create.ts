import type { RigidTransform } from "~transforms";

import type { Object } from "./types.ts";
import { Geometry } from "./geometry/types.ts";
import { Material } from "./materials/types.ts";

export const create = (
  { geometry, material, transform }: {
    geometry: Geometry;
    material?: Material;
    transform?: RigidTransform;
  },
): Object => [geometry, transform, material];
