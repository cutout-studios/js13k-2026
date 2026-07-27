export type { Geometry as ObjectGeometry } from "./geometry/types.ts";
export { cube as createCubeGeometry } from "./geometry/cube.ts";

export type {
  Direction as TransformDirection,
  Transform as ObjectTransform,
} from "./transforms/types.ts";
export { DEFAULT_TRANSFORM } from "./transforms/constants.ts";
export {
  // createOrientation as createOrientationTransform,
  createRotation as createRotationTransform,
  createTranslation as createTranslationTransform,
} from "./transforms/create.ts";
export { invert as invertTransform } from "./transforms/invert.ts";
export { scale as scaleTransform } from "./transforms/scale.ts";

export type { Material as ObjectMaterial } from "./materials/types.ts";
export { wgsl } from "./materials/wgsl.ts";

export type { Object as SceneObject, Scene } from "./types.ts";

export const OBJECT_TRANSFORM_INDEX = 1;
