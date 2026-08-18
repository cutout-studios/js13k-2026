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

import { F32 } from "~alias";
import type { GPURenderTarget } from "./types.ts";
import {
  CAMERA_MAGNIFICATION_RATIO,
  CAMERA_DEFAULT_SAFETY_CROP,
} from "./constants.ts";
import { loadObject } from "./webgpu/loadObject.ts";
import { XOObject } from "./objects.ts";
import { localize } from "./coordinates.ts";

export const createCamera = (
  safetyCropDistance = CAMERA_DEFAULT_SAFETY_CROP,
) => {
  let cachedAspectRatio = 0, viewingCoordinates: Float32Array;

  return (objects: XOObject[], target: GPURenderTarget) =>
    target.render((process) => {
      const { aspectRatio } = target;

      if (aspectRatio !== cachedAspectRatio) {
        cachedAspectRatio = aspectRatio;
        viewingCoordinates =
          // deno-fmt-ignore
          new F32([
            CAMERA_MAGNIFICATION_RATIO / aspectRatio, 0, 0, 0,
            0, CAMERA_MAGNIFICATION_RATIO, 0, 0,
            0, 0, -1, -1,
            0, 0, -2 * safetyCropDistance, 0,
          ]);
      }

      for (const object of objects) {
        // skip null/invisible objects
        if (!object.geometry || !object.material) continue;

        loadObject(
          process,
          object.geometry,
          localize(object.coordinates, viewingCoordinates),
          object.material,
        );

        process.draw(object.geometry.length);
      }
    });
};
