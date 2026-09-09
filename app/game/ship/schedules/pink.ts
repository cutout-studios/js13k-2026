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
  readHeading,
  readOrigin,
  scaleXYZ,
  subtractXYZ,
} from "~/3D";
import { hypot, min, NO_OP } from "~/alias";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { Band, clamp, doTimes, repeat, spread } from "~/common";
import { randomPoint } from "~/random";

import { isPointVisible } from "../../../elements/mainCanvas.ts";

import {
  createAimAction,
  createOrbitAction,
  createPullAction,
  EASE_IN,
  EASE_OUT,
} from "../../actions.ts";
import {
  BULLET_MAX_RANGE,
  ENEMY_BULLET_RAMP_TIME,
  ENEMY_FIRE_RANGE_MARGIN,
  PLAYER_AIM_Z_PLANE,
  PLAYER_X_BOUND,
  PLAYER_Y_BOUND,
} from "../../constants.ts";
import { getPlayerShip } from "../../player/ship.ts";

import { Bullet, Ship, WeaponSnapshot } from "../types.ts";

export const pinkBulletSequencerFactory = (
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
    repeat(3, spread(0.2)) as [Band, Band, Band],
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

export const pinkWeaponSequenceFactory = (
  fire: (ship: Ship) => void,
  snapshot: WeaponSnapshot,
): ActionSequencer<Ship> =>
  createActionSequencer([
    [fire],
    [NO_OP, 1 / snapshot[5]],
  ]);

export const pinkSequencerFactory = (
  _ship: Ship,
  arcPointRange: [Band, Band, Band] = repeat(3, spread(1)) as [
    Band,
    Band,
    Band,
  ],
) => {
  const startingPoint = readOrigin(_ship[0][0]),
    fieldPoint = randomPoint([
      spread(PLAYER_X_BOUND),
      spread(PLAYER_Y_BOUND),
      spread(0.5, -PLAYER_AIM_Z_PLANE),
    ]),
    referencePoint = randomPoint(arcPointRange),
    mirroredReferencePoint = addXYZ(
      startingPoint,
      subtractXYZ(fieldPoint, referencePoint),
    ),
    travelTime = hypot(...subtractXYZ(fieldPoint, startingPoint)) /
      _ship[5][16],
    orbitToAction = createOrbitAction(fieldPoint, referencePoint, EASE_OUT),
    orbitFromAction = createOrbitAction(
      startingPoint,
      mirroredReferencePoint,
      EASE_IN,
    ),
    aimAction = createAimAction(
      _ship[1],
      () => readOrigin(getPlayerShip()[0][0]),
      () => _ship[5][17],
    ),
    fireWeapons = (tickLength: number) => {
      const origin = readOrigin(_ship[0][0]);

      return isPointVisible(origin) &&
        origin[2] > -(PLAYER_AIM_Z_PLANE + ENEMY_FIRE_RANGE_MARGIN) &&
        doTimes(_ship[2], (weapon) => weapon[2](_ship, tickLength));
    };

  return createActionSequencer([
    [(_ship: Ship, ...args) => {
      orbitToAction(_ship[0], ...args);
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, travelTime],
    [(_ship: Ship, ...args) => {
      aimAction(_ship[0], ...args);

      const playerOrigin = readOrigin(getPlayerShip()[0][0]),
        shipOrigin = readHeading(_ship[0][0]);

      playerOrigin[2] = shipOrigin[2];

      adjustObject(_ship[0], [
        scaleXYZ(
          normalizeXYZ(
            subtractXYZ(shipOrigin, playerOrigin),
          ),
          (args[0] * _ship[5][16]) / 2,
        ),
      ]);

      fireWeapons(args[0]);
    }, clamp(4 / _ship[5][16], [2, 10])],
    [(_ship: Ship, ...args) => {
      orbitFromAction(_ship[0], ...args);
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, travelTime],
  ]);
};
