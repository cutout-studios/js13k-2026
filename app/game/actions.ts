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
import { Action } from "~/clock";
import { doTimes, repeat } from "~/common";
import { range } from "~/random";

export const orbit: Action<XOObject> = (object: XOObject, tickLength) =>
  adjustObject(object, [undefined, [
    repeat(3, tickLength) as XYZ,
    tickLength,
  ]]);

export const createPull = (
  direction: XYZ,
  // number should be <-inf, +inf>
  speed: Action<{ value: number }>,
  jitter = 0,
): Action<XOObject> => {
  const $ = { value: 1 };

  return ((object: XOObject, tickLength: number, ...rest) => {
    speed($, tickLength, ...rest);

    adjustObject(object, [
      scaleXYZ(
        normalizeXYZ(
          addXYZ(
            direction,
            doTimes(XYZ_LENGTH, () => range(jitter, -jitter)) as XYZ,
          ),
        ),
        $.value,
      ),
    ]);
  });
};

export const createRoll = (
  rotations: number,
  // number should be <0, 1>
  curve: Action<{ value: number }>,
): Action<XOObject> =>
(object: XOObject, tickLength, ...rest) => {
  const $ = { value: 0 };

  curve($, tickLength, ...rest);

  adjustObject(object, [undefined, [Z_AXIS, $.value * rotations]]);
};
