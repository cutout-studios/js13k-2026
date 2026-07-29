import type { RigidTransform } from "../rigid/types.ts";

import type { ProjectiveTransform } from "./types.ts";
import {
  IS_PROJECTIVE_TRANSFORM_DIRECTION,
  IS_PROJECTIVE_TRANSFORM_POINT,
} from "./constants.ts";

export const fromRigid = (
  [xAxis, yAxis, zAxis, origin]: RigidTransform,
): ProjectiveTransform =>
  new Float32Array([
    ...xAxis,
    IS_PROJECTIVE_TRANSFORM_DIRECTION,
    ...yAxis,
    IS_PROJECTIVE_TRANSFORM_DIRECTION,
    ...zAxis,
    IS_PROJECTIVE_TRANSFORM_DIRECTION,
    ...origin,
    IS_PROJECTIVE_TRANSFORM_POINT,
  ]);

export const toRigid = (
  [xx, xy, xz, _, yx, yy, yz, __, zx, zy, zz, ___, ox, oy, oz]:
    ProjectiveTransform,
): RigidTransform => [
  [xx, xy, xz],
  [yx, yy, yz],
  [zx, zy, zz],
  [ox, oy, oz],
];
