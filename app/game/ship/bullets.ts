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
  createPrism,
  localize,
  normalizeXYZ,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
  XOGeometry,
} from "~/3D";
import { getPanFromCoordinates } from "~/audio";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { doTimes, spliceTable } from "~/common";
import { rollBand } from "~/random";

import GameOptions, { BULLET_SPEED } from "../options/module.ts";

import { bulletSound } from "./sounds.ts";
import { Bullet, Ship } from "./types.ts";

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
      optionsIndex,
    ] = ship,
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
            bulletGeometry = [
              0.06,
              createPrism([0.008, 0.008, 0.18], 4),
            ] as XOGeometry,
            bulletSchedule = [[moveBullet]] as ActionSchedule<Bullet>,
          ] = [],
        ],
      ],
    ] = GameOptions[optionsIndex],
    [[mountCoordinates], [headingX, headingY, headingZ], , , snapshot] =
      weapons[weaponIndex],
    globalCoordinates = localize(mountCoordinates, shipCoordinates),
    globalOrigin = readOrigin(globalCoordinates),
    globalHeading = readOrigin(
      localize(
        setOrigin(createCoordinates(), [
          headingX - rollBand([-snapshot[6], snapshot[6]]),
          headingY - rollBand([-snapshot[6], snapshot[6]]),
          headingZ,
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
      paint(value),
    );

  aimObject(bulletObject, addXYZ(globalOrigin, bulletHeading));
  bulletSound(getPanFromCoordinates(bulletObject[0], 5));

  return [
    bulletObject,
    bulletHeading,
    createActionSequencer(bulletSchedule as ActionSchedule<Bullet>),
    snapshot[4],
  ];
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
