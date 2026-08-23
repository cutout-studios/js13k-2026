/**
 *    Copyright 2026 Cutout Studios LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type {
  RGBA,
  XOGeometry,
  XOMaterial,
  XOObject,
  XOOrientation,
  XYZ,
} from "./types.ts";

export {
  CAMERA_MAGNIFICATION_RATIO,
  X_AXIS,
  XYZ_LENGTH,
  Y_AXIS,
  Z_AXIS,
} from "./constants.ts";

export { setupDevice } from "./webgpu/setupDevice.ts";
export { createRenderTarget } from "./webgpu/createRenderTarget.ts";
export {
  adjustObject,
  aimObject,
  createObject,
  flattenObjects,
  getCollisionPairs,
} from "./objects.ts";
export { createCamera } from "./camera.ts";
export { createCoordinates, readOrigin, setOrigin } from "./coordinates.ts";
export { createPrism, createPyramid, createSphere } from "./geometry.ts";
export {
  create as createPaintMaterial,
  createPalette as createPaintPalette,
  createWithPalette as createPaintMaterialWithPalette,
} from "./materials/paint.ts";
export {
  add as addXYZ,
  cross as crossXYZ,
  normalize as normalizeXYZ,
  scale as scaleXYZ,
  subtract as subtractXYZ,
} from "./xyz.ts";
