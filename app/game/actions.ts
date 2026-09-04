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

import {
  addXYZ,
  adjustObject,
  normalizeXYZ,
  scaleXYZ,
  XOObject,
  XYZ,
  XYZ_LENGTH,
  Z_AXIS,
} from "~/3D";
import { TAU } from "~/alias";
import { Action } from "~/clock";
import { doTimes, repeat } from "~/common";
import { rollBand } from "~/random";

export const orbit: Action<XOObject> = (object: XOObject, tickLength) =>
  adjustObject(object, [undefined, [
    repeat(3, tickLength) as XYZ,
    tickLength,
  ]]);

export const createPull = (
  direction: XYZ,
  speed: number,
  curve: (value: number) => number = () => 1,
  jitter = 0,
): Action<XOObject> => {
  return ((object: XOObject, _, elapsedTime: number, duration: number) => {
    adjustObject(object, [
      scaleXYZ(
        normalizeXYZ(
          addXYZ(
            direction,
            doTimes(XYZ_LENGTH, () => rollBand([jitter, -jitter])) as XYZ,
          ),
        ),
        speed * curve(elapsedTime / duration),
      ),
    ]);
  });
};

export const createRoll = (
  rotations: number,
  curve: (value: number) => number = (n) => n,
): Action<XOObject> =>
(object: XOObject, _, elapsedTime, duration) =>
  adjustObject(object, [undefined, [
    Z_AXIS,
    curve(elapsedTime / duration) * rotations * TAU,
  ]]);
