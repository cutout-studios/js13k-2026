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

export {
  type RGBA,
  type XOGeometry,
  type XOMaterial,
  type XYZ,
} from "./types.ts";

export { CAMERA_FOCAL_LENGTH, XYZ_LENGTH } from "./constants.ts";

export { setupDevice } from "./webgpu/setupDevice.ts";
export { createRenderTarget } from "./webgpu/createRenderTarget.ts";
export { XOObject } from "./objects.ts";
export { createCamera } from "./createCamera.ts";
export { createCoordinates } from "./coordinates.ts";
export { createSquare, createTriangle } from "./geometry.ts";
export { paint as paintMaterial } from "./materials/paint.ts";
export {
  add as addXYZ,
  cross as crossXYZ,
  normalize as normalizeXYZ,
  subtract as subtractXYZ,
} from "./xyz.ts";
