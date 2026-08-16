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

import type { GPURenderTarget } from "./types.ts";
import {
  DEFAULT_CAMERA_SAFETY_CROP,
  DEFAULT_CAMERA_VIEWING_RADIANS,
} from "./constants.ts";
import { loadObject } from "./webgpu/loadObject.ts";
import { XOObject } from "./objects.ts";
import { XOCoordinates } from "./coordinates.ts";
import { PI, tan } from "../alias.ts";

export const createCamera = (
  viewingRadians = DEFAULT_CAMERA_VIEWING_RADIANS,
  safetyCropDistance = DEFAULT_CAMERA_SAFETY_CROP,
) => {
  const viewportHeight = tan(PI / 2 - viewingRadians / 2);

  let cachedAspectRatio = 0, viewingCoordinates: XOCoordinates;

  return (objects: XOObject[], target: GPURenderTarget) =>
    target.render((process) => {
      const { aspectRatio } = target;

      if (aspectRatio !== cachedAspectRatio) {
        cachedAspectRatio = aspectRatio;
        viewingCoordinates = new XOCoordinates(
          // deno-fmt-ignore
          new Float32Array([
            viewportHeight / aspectRatio, 0, 0, 0,
            0, viewportHeight, 0, 0,
            0, 0, -1, -1,
            0, 0, -2 * safetyCropDistance, 0,
          ]),
        );
      }

      for (const object of objects) {
        // skip null/invisible objects
        if (!object.geometry || !object.material) continue;

        loadObject(
          process,
          object.geometry,
          XOCoordinates.localize(object.coordinates, viewingCoordinates),
          object.material,
        );

        process.draw(object.geometry.length);
      }
    });
};
