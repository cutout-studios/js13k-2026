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

import { cos, hypot, max, sin } from "~/alias";
import { doTimes } from "~/common";
import { keyboard, pointer } from "~/controller";
import {
  createCoordinates,
  crossXYZ,
  normalizeXYZ,
  scaleXYZ,
  subtractXYZ,
  XYZ,
  XYZ_LENGTH,
  Y_AXIS,
} from "~/3D";
import { approach, create as createEnvelope } from "~/envelope";

import { mapClientXY } from "../../elements/mainCanvas.ts";

import { PlayerState } from "../types.ts";

const STRAFE_KEYS = ["KeyD", "KeyA", "KeyW", "KeyS"],
  strafeEnvelopes = doTimes(
    STRAFE_KEYS.length,
    () => createEnvelope(0.30, 0.35),
  );

export const updateShip = (
  [ship, [, , sheet]]: PlayerState,
  tickLength: number,
) => {
  const strafeMagnitudes: XYZ = [0, 0, 0];
  doTimes(STRAFE_KEYS.length, (index: number) => {
    const value = strafeEnvelopes[index](
      tickLength,
      !keyboard.has(STRAFE_KEYS[index]),
    );
    strafeMagnitudes[index >> 1] += index & 1 ? -value : value;
  });

  ship.body[0].adjust(
    scaleXYZ(
      strafeMagnitudes,
      sheet[26] * tickLength / max(1, hypot(...strafeMagnitudes)),
    ),
  );

  if (pointer) {
    const [object, _, roll] = ship.body;
    const target = mapClientXY(pointer[0]);
    const ratio = tickLength / sheet[27];
    const aim = ship.body[1] = doTimes(
      XYZ_LENGTH,
      (index) => approach(ship.body[1][index], target[index], ratio),
    ) as XYZ;

    const zAxis = normalizeXYZ(subtractXYZ(object.position, aim)),
      right = normalizeXYZ(crossXYZ(Y_AXIS, zAxis)),
      up = crossXYZ(zAxis, right),
      s = sin(roll),
      c = cos(roll);

    object.coordinates = createCoordinates(
      doTimes(XYZ_LENGTH, (index) => right[index] * c + up[index] * s) as XYZ,
      doTimes(XYZ_LENGTH, (index) => up[index] * c - right[index] * s) as XYZ,
      zAxis,
      object.position,
    );
  }
};
