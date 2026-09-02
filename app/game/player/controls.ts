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

import { adjustObject, scaleXYZ, XYZ, XYZ_LENGTH } from "~/3D";
import { hypot, max } from "~/alias";
import { ActionSchedule, approachFactory, createEnvelope } from "~/clock";
import { doTimes } from "~/common";
import { keyboard, pointer } from "~/controller";

import { mapClientXY } from "../../elements/mainCanvas.ts";

import { advanceShip } from "../ship/module.ts";

import { Ship, Weapon } from "../ship/types.ts";
import {
  STRAFE_ATTACK_TIME,
  STRAFE_KEYS,
  STRAFE_RELEASE_TIME,
} from "./constants.ts";

const strafeEnvelopes = doTimes(
  STRAFE_KEYS,
  () => createEnvelope(STRAFE_ATTACK_TIME, STRAFE_RELEASE_TIME),
);

export const controlSchedule: ActionSchedule<Ship> = [[(ship, tickLength) => {
  const [object, heading, , , , _snapshot] = ship;
  const strafeMagnitudes: XYZ = [0, 0, 0];
  doTimes(STRAFE_KEYS, (key, index) => {
    const value = strafeEnvelopes[index](
      tickLength,
      !keyboard.has(key),
    );

    strafeMagnitudes[index >> 1] += index & 1 ? -value : value;
  });

  adjustObject(object, [scaleXYZ(
    strafeMagnitudes,
    (_snapshot[20] * tickLength) / max(1, hypot(...strafeMagnitudes)),
  )]);

  if (pointer) {
    const target = mapClientXY(pointer[0]);

    ship[1] = doTimes(
      XYZ_LENGTH,
      (index: number) => {
        const valueObject = { value: heading[index] };

        approachFactory(target[index])(
          valueObject,
          tickLength,
          0, // don't need this
          _snapshot[21],
        );

        return valueObject.value;
      },
    ) as XYZ;
  }

  advanceShip(ship, tickLength);

  doTimes(
    ship[2],
    (weapon: Weapon, index: number) =>
      pointer && pointer[1] >> index & 1 && weapon[3](ship, tickLength),
  );
}]];

export const spinSchedule = [[() => {
  // pull in direction of motion, spin
}], [() => {
  // restore regular control schedule
}]];
