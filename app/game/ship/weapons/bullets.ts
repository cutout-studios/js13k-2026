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
  createCoordinates,
  createObject,
  createPaintMaterialWithPalette as paint,
  localize,
  normalizeXYZ,
  readHeading,
  readOrigin,
  setOrigin,
  subtractXYZ,
  XOGeometry,
} from "~/3D";
import { max, min, NO_OP, round } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { doTimes, spliceTable } from "~/common";
import { rollSpread } from "~/random";

import { isPointVisible } from "../../../elements/mainCanvas.ts";
import { createPullAction } from "../../actions.ts";
import {
  BULLET_ALPHA,
  BULLET_MAX_RANGE,
  ENEMY_BULLET_RAMP_TIME,
} from "../../constants.ts";
import GameOptions from "../../options/module.ts";
import { Bullet, Ship } from "../types.ts";

// TODO: fold together various behaviors
export const defaultBulletSequencerFactory = (
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

      return newOrigin[2] >= 0 ||
        newOrigin[2] < -BULLET_MAX_RANGE ||
        !isPointVisible(newOrigin);
    },
  ]]);
};

export const createBullet = (
  ship: Ship,
  weaponIndex: number,
): Bullet => {
  const [
      [shipCoordinates],
      ,
      weapons,
      ,
      ,
      ,
      shipOptionsIndex,
    ] = ship,
    [
      [mountCoordinates],
      ,
      ,
      snapshot,
      optionsIndex,
    ] = weapons[weaponIndex],
    [
      ,
      value,
      [
        ,
        ,
        ,
        [
          [
            ,
            ,
            ,
            [
              bulletGeometry,
              bulletSequencerFactory,
              bulletSound,
            ] = [],
          ],
        ],
      ],
    ] = GameOptions[optionsIndex],
    globalCoordinates = localize(mountCoordinates, shipCoordinates),
    globalOrigin = readOrigin(globalCoordinates),
    effectiveSpread = round(snapshot[0]) > 1
      ? max(snapshot[6], 0.01)
      : snapshot[6],
    globalHeading = readOrigin(
      localize(
        setOrigin(createCoordinates(), [
          -rollSpread(effectiveSpread),
          -rollSpread(effectiveSpread),
          1,
        ]),
        globalCoordinates,
      ),
    ),
    bulletHeading = normalizeXYZ(
      subtractXYZ(
        globalHeading,
        globalOrigin,
      ),
    ),
    bulletObject = createObject(
      [globalOrigin],
      bulletGeometry as XOGeometry,
      paint((value & 0xFFFFFF00) | BULLET_ALPHA),
    );

  aimObject(bulletObject, addXYZ(globalOrigin, bulletHeading));
  bulletSound?.(
    getPanFromCoordinates(bulletObject[0], 5),
    readOrigin(bulletObject[0])[2] / 18,
  );

  const bullet: Bullet = [bulletObject, createActionSequencer([[NO_OP]]), ship, weaponIndex];
  bullet[1] = (bulletSequencerFactory ?? defaultBulletSequencerFactory)(
    bullet,
    snapshot[4],
    !!shipOptionsIndex,
  );

  return bullet;
};

export const updateBullets = (ship: Ship, tickLength: number) =>
  ship[2].forEach(([, bullets]) => {
    const bulletsToCull = [] as number[];

    doTimes(
      bullets[0],
      (
        bullet: Bullet,
        index: number,
      ) => bullet[1](bullet, tickLength) && bulletsToCull.push(index),
    );

    spliceTable(bullets, bulletsToCull);
  });
