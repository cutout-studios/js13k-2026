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
  createPrism,
  normalizeXYZ,
  readHeading,
  readOrigin,
  scaleXYZ,
  subtractXYZ,
  XYZ,
} from "~/3D";
import { hypot, min, NO_OP } from "~/alias";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { Band, clamp, doTimes, spread } from "~/common";
import { randomPoint } from "~/random";

import { isPointVisible } from "../../elements/mainCanvas.ts";
import {
  createOrbitAction,
  createPlayerAimAction,
  createPullAction,
} from "../actions.ts";
import { EASE_IN, EASE_OUT } from "../curves.ts";
import { getPlayerShip } from "../player/ship.ts";
import { Bullet } from "../ship/types.ts";
import { Ship, WeaponSnapshot } from "../ship/types.ts";
import { PLAYER_AIM_Z_PLANE, PLAYER_X_BOUND, PLAYER_Y_BOUND } from "./base.ts";

export const defaultBulletGeometry = createPrism([0.006, 0.006, 0.12], 12);

export const defaultWeaponSequencerFactory = (
  fire: (ship: Ship) => void,
  snapshot: WeaponSnapshot,
): ActionSequencer<Ship> =>
  createActionSequencer([
    [fire],
    [NO_OP, 1 / snapshot[5]],
  ]);

export const defaultBulletSequencerFactory = (jitter?: [Band, Band, Band]) =>
(
  [[coordinates]]: Bullet,
  speed: number,
  isEnemy: boolean,
): ActionSequencer<Bullet> => {
  const pullAction = createPullAction(
    readHeading(coordinates),
    speed,
    isEnemy ? (elapsedTime: number) => min(1, elapsedTime / 0.3) : () => 1,
    jitter,
  );

  return createActionSequencer([[
    (bullet: Bullet, ...args) => {
      pullAction(bullet[0], ...args);

      const newOrigin = readOrigin(coordinates);

      return newOrigin[2] >= 0 ||
        newOrigin[2] < -20 ||
        (isEnemy && !isPointVisible(newOrigin));
    },
  ]]);
};

// gates each of a ship's weapons behind its own fire-rate cooldown before
// it's allowed to fire at all ("summoning sickness"), and behind an
// optional extra block condition (e.g. out of range) - shared by any ship
// sequencer that just needs "aim and fire when able", enemy or player
export const createFireWeaponsAction = (
  _ship: Ship,
  isBlocked: (origin: XYZ) => boolean = () => false,
) => {
  const readyElapsed = doTimes(_ship[2], () => 0);

  return (tickLength: number) => {
    const origin = readOrigin(_ship[0][0]);

    if (!isPointVisible(origin) || isBlocked(origin)) {
      return doTimes(readyElapsed, (_, index) => readyElapsed[index] = 0);
    }

    doTimes(_ship[2], (weapon, index) => {
      readyElapsed[index] += tickLength;
      // summoning sickness
      if (readyElapsed[index] >= 1 / weapon[3][5]) {
        weapon[2](_ship, tickLength);
      }
    });
  };
};

export const defaultShipSequencerFactory = (
  pause = (shipSpeed: number) => clamp(4 / shipSpeed, [2, 10]),
  exitCurve = EASE_OUT,
) =>
(_ship: Ship) => {
  const startingPoint = readOrigin(_ship[0][0]),
    fieldPoint = randomPoint([
      spread(PLAYER_X_BOUND),
      spread(PLAYER_Y_BOUND),
      spread(0.5, -PLAYER_AIM_Z_PLANE),
    ]),
    mirroredReferencePoint = addXYZ(
      startingPoint,
      fieldPoint,
    ),
    travelTime = hypot(...subtractXYZ(fieldPoint, startingPoint)) /
      _ship[5][16],
    orbitToAction = createOrbitAction(fieldPoint, [0, 0, 0], exitCurve),
    orbitFromAction = createOrbitAction(
      startingPoint,
      mirroredReferencePoint,
      EASE_IN,
    ),
    aimAction = createPlayerAimAction(_ship),
    fireWeapons = createFireWeaponsAction(
      _ship,
      (origin) => origin[2] <= -(PLAYER_AIM_Z_PLANE + 2),
    );

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
    }, pause(_ship[5][16])],
    [(_ship: Ship, ...args) => {
      orbitFromAction(_ship[0], ...args);
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, travelTime],
  ]);
};
