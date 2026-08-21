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

import { hypot, length, max } from "~/alias";
import { doTimes, OneOrMore } from "~/common";
import { keyboard, pointer } from "~/controller";
import { scaleXYZ, XOObject, XYZ, XYZ_LENGTH } from "~/3D";
import { approachFactory, createEnvelope } from "~/clock";

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
    const target = mapClientXY(pointer[0]);

    ship.body[1] = doTimes(
      XYZ_LENGTH,
      (index) =>
        approachFactory(target[index])(
          ship.body[1][index],
          tickLength,
          0, // don't need this
          target[index],
        ),
    ) as XYZ;

    ship.body[0].aim(ship.body[1]);
  }

  /*
    TODO - for each weapon:
      if held, call sequence to generate bullets
      iterate over new bullet list from the end:
        advance each bullet sequence
        cull the ones that are empty
  */
};

export const getShipObjects = ([ship]: PlayerState): OneOrMore<XOObject>[] =>
  ship.weapons.reduce((objects, [, [, bullets]]) => {
    if (length(bullets)) objects.push(bullets as OneOrMore<XOObject>);

    return objects;
  }, [[ship.body[0]]] as OneOrMore<XOObject>[]);
