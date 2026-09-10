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

// TODO: fades in and is stationary, then fires

import { readHeading, readOrigin } from "~/3D";
import { min, NO_OP } from "~/alias";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { doTimes } from "~/common";

import { isPointVisible } from "../../../elements/mainCanvas.ts";

import {
  createAimAction,
  createPullAction,
} from "../../actions.ts";
import {
  BULLET_MAX_RANGE,
  ENEMY_BULLET_RAMP_TIME,
} from "../../constants.ts";
import { getPlayerShip } from "../../player/ship.ts";

import { Bullet, Ship, WeaponSnapshot } from "../types.ts";

// TODO: purple-specific bullet jitter/behavior, if any
export const purpleBulletSequencerFactory = (
  [[coordinates]]: Bullet,
  speed: number,
  isEnemy: boolean,
): ActionSequencer<Bullet> => {
  const pullAction = createPullAction(
    readHeading(coordinates),
    speed,
    isEnemy
      ? (elapsedTime: number) => min(1, elapsedTime / ENEMY_BULLET_RAMP_TIME)
      : () => 1,
  );

  return createActionSequencer([[
    (bullet: Bullet, ...args) => {
      pullAction(bullet[0], ...args);

      const newOrigin = readOrigin(coordinates);

      // cull once it's passed the camera, out past the play field, or
      // drifted outside the visible frustum
      return newOrigin[2] >= 0 ||
        newOrigin[2] < -BULLET_MAX_RANGE ||
        !isPointVisible(newOrigin);
    },
  ]]);
};

// TODO: purple-specific fire pattern (fades in, then fires, per the TODO
// above)
export const purpleWeaponSequenceFactory = (
  fire: (ship: Ship) => void,
  snapshot: WeaponSnapshot,
): ActionSequencer<Ship> =>
  createActionSequencer([
    [fire],
    [NO_OP, 1 / snapshot[5]],
  ]);

export const purpleSequencerFactory = (
  _ship: Ship,
) => {
  const aimAction = createAimAction(
      _ship[1],
      () => readOrigin(getPlayerShip()[0][0]),
      () => _ship[5][17],
    ), fireWeapons = (tickLength: number) => {
      const origin = readOrigin(_ship[0][0]);

      return isPointVisible(origin) &&
        doTimes(_ship[2], (weapon) => weapon[2](_ship, tickLength));
    };

  return createActionSequencer([
    [NO_OP, 1], 
    [(_ship: Ship, ...args) => {
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }]
  ])
};
