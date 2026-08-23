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

import { F32, min } from "~/alias";
import type { GPURenderTarget } from "./types.ts";
import {
  CAMERA_DEFAULT_OBJECT_LIMIT,
  CAMERA_DEFAULT_SAFETY_CROP,
  CAMERA_MAGNIFICATION_RATIO,
  COORDINATE_DATA_LENGTH,
} from "./constants.ts";
import { loadObject } from "./webgpu/loadObject.ts";
import { XOObject } from "./types.ts";
import { localize } from "./coordinates.ts";
import { memo, OneOrMore } from "~/common";

export const createCamera = (
  objectLimit = CAMERA_DEFAULT_OBJECT_LIMIT,
  safetyCropDistance = CAMERA_DEFAULT_SAFETY_CROP,
) => {
  let cachedAspectRatio = 0, viewingCoordinates: Float32Array;

  const _getStableCoordinateBuffer = memo((_group: XOObject | XOObject[]) =>
    new F32(COORDINATE_DATA_LENGTH * objectLimit)
  );

  return (objectGroups: OneOrMore<XOObject>[], target: GPURenderTarget) =>
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

      for (const group of objectGroups) {
        const [[, geometry, material]] = group;

        // skip invisible objects
        if (!material) continue;

        loadObject(
          process,
          group.reduce(
            (buffer, [coordinates], index) => {
              buffer.set(
                localize(coordinates, viewingCoordinates),
                index * COORDINATE_DATA_LENGTH,
              );

              return buffer;
            },
            _getStableCoordinateBuffer(group),
          ),
          geometry,
          material,
        );

        process.draw(geometry[1].length, min(group.length, objectLimit));
      }
    });
};
