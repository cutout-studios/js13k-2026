import { DEFAULT_TRANSFORM, getDefaultMaterial } from "~objects";
import { cube } from "./geometery/cube.js";

export const create = (
  {
    geometery = cube(),
    material = getDefaultMaterial(),
    transform = DEFAULT_TRANSFORM,
  },
) => ({
  geometery,
  material,
  transform,
});
