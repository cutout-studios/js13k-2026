import { type Radians } from "~common";

import type { Projection } from "./types.ts";
import { DEFAULT_PERSPECTIVE_SAFETY_CROP } from "./constants.ts";

export const createPerspective = (
  aspectRatio: number,
  viewingAngle: Radians,
  safetyCrop = DEFAULT_PERSPECTIVE_SAFETY_CROP,
): Projection => {
  const viewportHeight = Math.tan(Math.PI / 2 - viewingAngle / 2);

  // deno-fmt-ignore
  return new Float32Array([
    viewportHeight / aspectRatio, 0, 0, 0,
    0, viewportHeight, 0, 0,
    0, 0, -1, -1,
    0, 0, -2 * safetyCrop, 0
  ]);
};
