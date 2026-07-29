import { RigidTransform } from "~transforms";

import type { Object } from "./types.ts";

export const setTransform = (
  object: Object,
  transform: RigidTransform,
) => object[1] = transform;
