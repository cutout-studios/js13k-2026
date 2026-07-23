import { getDefault as getDefaultMaterial } from "./materials/default.ts";
import { cube } from "./geometery/cube.ts";
import { getDefault as getDefaultTransform } from "./transforms/getters.ts";

export const create = (
  {
    geometery = cube(),
    material = getDefaultMaterial(),
    transform = getDefaultTransform(),
  },
) => ({
  geometery,
  material,
  transform,
});
