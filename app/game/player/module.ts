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
import {
  adjustObject,
  aimObject,
  scaleXYZ,
  XOObject,
  XYZ,
  XYZ_LENGTH,
} from "~/3D";
import { approachFactory, createEnvelope } from "~/clock";

import { mapClientXY } from "../../elements/mainCanvas.ts";

import { Player } from "./types.ts";

const STRAFE_KEYS = ["KeyD", "KeyA", "KeyW", "KeyS"],
  strafeEnvelopes = doTimes(
    STRAFE_KEYS.length,
    () => createEnvelope(0.30, 0.35),
  );

export const updatePlayer = (player: Player, tickLength: number) => {
  const [[body, weapons], [, , sheet]] = player;
  const strafeMagnitudes: XYZ = [0, 0, 0];
  doTimes(STRAFE_KEYS.length, (index: number) => {
    const value = strafeEnvelopes[index](
      tickLength,
      !keyboard.has(STRAFE_KEYS[index]),
    );

    strafeMagnitudes[index >> 1] += index & 1 ? -value : value;
  });

  adjustObject(body[0], [scaleXYZ(
    strafeMagnitudes,
    sheet[26] * tickLength / max(1, hypot(...strafeMagnitudes)),
  )]);

  if (pointer) {
    const target = mapClientXY(pointer[0]);

    body[1] = doTimes(
      XYZ_LENGTH,
      (index) =>
        approachFactory(target[index])(
          body[1][index],
          tickLength,
          0, // don't need this
          sheet[27],
        ),
    ) as XYZ;

    aimObject(body[0], body[1]);
  }

  doTimes(2, (index) => {
    const [[bulletObjects, bulletSequences], weaponSequence] = weapons[index];

    if (pointer && pointer[1] & (1 << index)) { // respective mouse button press
      const bullet = weaponSequence(player, tickLength);

      if (bullet) {
        bulletObjects.push(bullet[0]);
        bulletSequences.push(bullet[1]);
      }
    }
  });
};

export const getShipObjects = (
  [[[shipObject], [[[leftBulletObjects]], [[rightBulletObjects]]]]]:
    PlayerState,
): [ship: XOObject[], leftBullets: XOObject[], rightBullets: XOObject[]] => [
  [shipObject],
  leftBulletObjects,
  rightBulletObjects,
];
