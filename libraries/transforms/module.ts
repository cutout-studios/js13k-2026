// NOTE: "Transforms" are the piece of all this I intuitively understand the least.
// This organizing/grouping of concerns may well not actually make sense, I'm still in a bit of a daze about it.

export type {
  Direction as RigidTransformDirection,
  RigidTransform,
} from "./rigid/types.ts";
export { DEFAULT_RIGID_TRANSFORM } from "./rigid/constants.ts";
export {
  // createOrientation as createOrientationTransform,
  createRotation,
  createTranslation,
} from "./rigid/create.ts";
export { invert } from "./rigid/invert.ts";

export type { ProjectiveTransform } from "./projective/types.ts";
export { combine } from "./projective/combine.ts";
export { createPerspective } from "./projective/createPerspective.ts";
export { fromRigid, toRigid } from "./projective/rigid.ts";
export * from "./projective/constants.ts";
