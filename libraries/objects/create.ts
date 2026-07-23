import type { Object } from "~common";

import { getDefault as getDefaultMaterial } from "./materials/default.ts";
import { cube } from "./geometery/cube.ts";
import { getDefault as getDefaultTransform } from "./transforms/getters.ts";

export const create = (
  {
    geometry = cube(),
    material = getDefaultMaterial(),
    transform = getDefaultTransform(),
  },
): Object => ({
  geometry,
  material,
  transform,
});
