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

import { doTimes, spliceTable } from "~/common";
import {
  addXYZ,
  aimObject,
  createObject,
  createPaintMaterialWithPalette as paint,
  createPrism,
  createRotation,
  localize,
  normalizeXYZ,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
  XOOrientation,
  XYZ,
  Z_AXIS,
} from "~/3D";
import { ActionSchedule, createActionSequencer } from "~/clock";

import { Bullet, Ship } from "./types.ts";

import { BULLET_SPEED } from "./constants.ts";

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
      [
        ,
        value,
        [
          ,
          ,
          ,
          [
            ,
            ,
            ,
            [
              bulletGeometry,
              bulletSchedule = [[moveBullet]] as ActionSchedule<Bullet>,
            ] = [],
          ],
        ],
      ],
    ] = ship,
    [[mountCoordinates], localHeading, , , snapshot] = weapons[weaponIndex],
    coordinates = localize(mountCoordinates, shipCoordinates),
    origin = readOrigin(coordinates),
    aim = subtractXYZ(
      readOrigin(
        localize(setOrigin(createRotation(), localHeading), coordinates),
      ),
      origin,
    );
  const object = createObject([origin], bulletGeometry, paint(value));

  aimObject(object, aim);

  return [object, aim, createActionSequencer(bulletSchedule), snapshot[4]];
};

export const moveBullet = (
  [[coordinates], heading, , lifetime]: Bullet,
  tickLength: number,
  elapsedTime: number,
) => {
  if (elapsedTime >= lifetime) return true;

  setOrigin(
    coordinates,
    addXYZ(
      readOrigin(coordinates),
      scaleXYZ(heading, tickLength * BULLET_SPEED),
    ),
  );
};

export const updateBullets = (ship: Ship, tickLength: number) =>
  ship[2].forEach(([, , bullets]) => {
    const bulletsToCull = [] as number[];

    doTimes(
      bullets[0],
      (
        bullet: Bullet,
        index: number,
      ) => (bullet[2](bullet, tickLength) && bulletsToCull.push(index)),
    );

    spliceTable(bullets, bulletsToCull);
  });
