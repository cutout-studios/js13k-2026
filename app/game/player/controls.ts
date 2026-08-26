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

import { hypot, max } from "~/alias";
import { doTimes } from "~/common";
import { keyboard, pointer } from "~/controller";
import { adjustObject, aimObject, scaleXYZ, XYZ, XYZ_LENGTH } from "~/3D";
import { ActionSequencer, approachFactory, createEnvelope } from "~/clock";

import { mapClientXY } from "../../elements/mainCanvas.ts";

import { Ship } from "../ship/types.ts";

import {
  STRAFE_ATTACK_TIME,
  STRAFE_KEYS,
  STRAFE_RELEASE_TIME,
} from "./constants.ts";

const strafeEnvelopes = doTimes(
  STRAFE_KEYS.length,
  () => createEnvelope(STRAFE_ATTACK_TIME, STRAFE_RELEASE_TIME),
);

// TODO: spin counter
// TODO: boost
export const controlSequence: ActionSequencer<Ship> = (ship, tickLength) => {
  const [object, heading, weapons, , , statBlock] = ship;
  const strafeMagnitudes: XYZ = [0, 0, 0];
  doTimes(STRAFE_KEYS.length, (index: number) => {
    const value = strafeEnvelopes[index](
      tickLength,
      !keyboard.has(STRAFE_KEYS[index]),
    );

    strafeMagnitudes[index >> 1] += index & 1 ? -value : value;
  });

  adjustObject(object, [scaleXYZ(
    strafeMagnitudes,
    statBlock[19] * tickLength / max(1, hypot(...strafeMagnitudes)),
  )]);

  if (pointer) {
    const target = mapClientXY(pointer[0]);

    ship[1] = doTimes(
      XYZ_LENGTH,
      (index) => {
        const valueObject = { value: heading[index] };

        approachFactory(target[index])(
          valueObject,
          tickLength,
          0, // don't need this
          statBlock[20],
        );

        return valueObject.value;
      },
    ) as XYZ;

    aimObject(object, ship[1]);
  }

  weapons.forEach((weapon, index) =>
    pointer && pointer[1] & (1 << index) && (weapon[1] = ship[1]) &&
    weapon[3](weapon, tickLength)
  );

  return true;
};
