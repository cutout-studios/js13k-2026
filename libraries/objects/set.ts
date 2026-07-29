import { RigidTransform } from "~transforms";

import type { Object } from "./types.ts";
import type { Material } from "./materials/types.ts";

const OBJECT_TRANSFORM_INDEX = 1;
const OBJECT_MATERIAL_INDEX = 2;

export const setTransform = (
  object: Object,
  transform: RigidTransform,
) => object[OBJECT_TRANSFORM_INDEX] = transform;

export const setMaterial = (
  object: Object,
  material: Material,
) => object[OBJECT_MATERIAL_INDEX] = material;
