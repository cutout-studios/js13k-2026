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
import { doTimes, spliceTable } from "~/common";
import { keyboard, pointer } from "~/controller";
import {
  adjustObject,
  aimObject,
  readOrigin,
  scaleXYZ,
  setOrigin,
  XYZ,
  XYZ_LENGTH,
} from "~/3D";
import { ActionSchedule, approachFactory, createEnvelope } from "~/clock";

import { mapClientXY } from "../../elements/mainCanvas.ts";

import { Bullet, Ship } from "../ship/types.ts";

import {
  STRAFE_ATTACK_TIME,
  STRAFE_KEYS,
  STRAFE_RELEASE_TIME,
} from "./constants.ts";

const strafeEnvelopes = doTimes(
  STRAFE_KEYS,
  () => createEnvelope(STRAFE_ATTACK_TIME, STRAFE_RELEASE_TIME),
);

// TODO: spin counter
// TODO: boost
export const controlSchedule: ActionSchedule<Ship> = [[(ship, tickLength) => {
  const [object, heading, weapons, , , statBlock] = ship;
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
    statBlock[19] * tickLength / max(1, hypot(...strafeMagnitudes)),
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
          statBlock[20],
        );

        return valueObject.value;
      },
    ) as XYZ;

    aimObject(object, ship[1]);
  }

  // TODO!: combine this with default action somehow
  doTimes(weapons, (weapon, index) => {
    setOrigin(weapon[0][0], readOrigin(ship[0][0]));
    weapon[1] = ship[1];
    const bulletsToCull: number[] = [];
    doTimes(weapon[2][0], (bullet: Bullet, bulletIndex: number) => {
      if (!bullet[1](bullet, tickLength)) bulletsToCull.push(bulletIndex);
    });
    spliceTable(weapon[2], bulletsToCull);
    pointer && pointer[1] & (1 << index) && weapon[3](weapon, tickLength);
  });

  return true;
}]];
