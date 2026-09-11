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
  aimObject,
  createObject,
  createPaintMaterialWithPalette as paint,
  createSphere,
  normalizeXYZ,
  readHeading,
  readOrigin,
  setOrigin,
  subtractXYZ,
  XOGeometry,
} from "~/3D";
import { hypot, NO_OP } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { Band, clamp, doTimes, repeat, spread } from "~/common";

import { randomDirection, randomPoint } from "~/random";

import { isPointVisible } from "../../../elements/mainCanvas.ts";

import {
  createAimAction,
  createOrbitAction,
  createPullAction,
  EASE_IN,
  EASE_OUT,
} from "../../actions.ts";
import {
  ENEMY_FIRE_RANGE_MARGIN,
  PLAYER_AIM_Z_PLANE,
  PLAYER_SHIP_Z_PLANE,
  PLAYER_X_BOUND,
  PLAYER_Y_BOUND,
} from "../../constants.ts";
import { getPlayerShip } from "../../player/ship.ts";
import { errorSound, yellowBombExplodeSound } from "../../sounds.ts";

import { Bullet, Ship, WeaponSnapshot } from "../types.ts";
import { defaultBulletSequencerFactory } from "../weapons/bulletMovement.ts";

const GLOW_MATERIAL = paint(0xF4AD32FF),
  WARN_MATERIAL = paint(0xED8523FF),
  MIN_BOMB_DEPTH = PLAYER_SHIP_Z_PLANE + 2,
  keepFromPlayer = (bullet: Bullet) => {
    const origin = readOrigin(bullet[0][0]);

    if (origin[2] > -MIN_BOMB_DEPTH) {
      setOrigin(bullet[0][0], [origin[0], origin[1], -MIN_BOMB_DEPTH]);
    }
  };

export const yellowBulletSequencerFactory = (
  [[coordinates]]: Bullet,
  speed: number,
): ActionSequencer<Bullet> => {
  const pullAction = createPullAction(
      readHeading(coordinates),
      speed,
      (t: number) => 1 - t, // decelerate
      [spread(0.1), spread(0.1), [0, 0]],
    ),
    sequence = createActionSequencer([[
      (bullet: Bullet, ...args) => {
        pullAction(bullet[0], ...args);
        bullet[0][2] = GLOW_MATERIAL;
      },
      2.5 / speed,
    ], [(bullet: Bullet) => {
      errorSound(
        getPanFromCoordinates(bullet[0][0]),
        readOrigin(bullet[0][0])[2] / 14,
      );
    }], [
      (bullet: Bullet) => {
        bullet[0][2] = WARN_MATERIAL;
      },
      0.1,
    ], [
      (bullet: Bullet) => {
        bullet[0][2] = GLOW_MATERIAL;
      },
      0.1,
    ], [
      (bullet: Bullet) => {
        bullet[0][2] = WARN_MATERIAL;
      },
      0.1,
    ], [
      (bullet: Bullet) => {
        bullet[0][2] = GLOW_MATERIAL;
      },
      0.2,
    ], [
      (bullet: Bullet) => {
        yellowBombExplodeSound(
          getPanFromCoordinates(bullet[0][0]),
          readOrigin(bullet[0][0])[2] / 14,
        );

        const fragmentGeometry = [0.01, ...createSphere(0.01)] as XOGeometry,
          fragmentMaterial = paint(0xF4AD3266),
          bombHeading = readHeading(bullet[0][0]),
          bullets = doTimes(bullet[2]![2][0][3][3], () => {
            const bulletObject = createObject(
              [readOrigin(bullet[0][0])],
              fragmentGeometry,
              fragmentMaterial,
            );

            aimObject(
              bulletObject,
              addXYZ(
                readOrigin(bulletObject[0]),
                normalizeXYZ(addXYZ(bombHeading, randomDirection())),
              ),
            );

            return [
              bulletObject,
              defaultBulletSequencerFactory(
                [bulletObject, createActionSequencer([[NO_OP]])],
                8,
                false,
              ),
            ];
          }) as Bullet[];

        const weaponBullets = bullet[2]![2][1][1];

        weaponBullets[0].push(...bullets);
        weaponBullets[1].push(...doTimes(bullets, ([object]) => object));
      },
    ]], 1);

  return (bullet: Bullet, ...args) => (
    keepFromPlayer(bullet), sequence(bullet, ...args)
  );
};

export const yellowWeaponSequenceFactory = (
  fire: (ship: Ship) => void,
  snapshot: WeaponSnapshot,
): ActionSequencer<Ship> =>
  createActionSequencer([
    [NO_OP, 1 / snapshot[5]],
    [fire],
  ]);

export const yellowSequencerFactory = (
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
        _ship[2][0][2](_ship, tickLength);
    };

  return createActionSequencer([
    [(_ship: Ship, ...args) => {
      orbitToAction(_ship[0], ...args);
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, travelTime],
    [(_ship: Ship, ...args) => {
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, clamp(4 / _ship[5][16], [2, 10])],
    [(_ship: Ship, ...args) => {
      orbitFromAction(_ship[0], ...args);
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, travelTime],
  ]);
};
