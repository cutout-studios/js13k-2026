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
  readHeading,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
  XOGeometry,
} from "~/3D";
import { max, min, round } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { doTimes, flat, spliceTable } from "~/common";
import { rollSpread } from "~/random";

import { isPointVisible } from "../../../elements/mainCanvas.ts";
import GameOptions, {
  BULLET_ALPHA,
  BULLET_MAX_RANGE,
  ENEMY_BULLET_RAMP_TIME,
} from "../../options/module.ts";

import { Bullet, Ship } from "../types.ts";

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
              bulletGeometry = flat(
                [0.06],
                createPrism([0.006, 0.006, 0.12], 12),
              ) as XOGeometry,
              bulletSchedule = [[
                (
                  [[coordinates]]: Bullet,
                  tickLength: number,
                  elapsedTime: number,
                ) => {
                  const newOrigin = addXYZ(
                    readOrigin(coordinates),
                    scaleXYZ(
                      readHeading(coordinates),
                      tickLength * snapshot[4] *
                        (shipOptionsIndex
                          ? (elapsedTime: number) =>
                            min(1, elapsedTime / ENEMY_BULLET_RAMP_TIME)
                          : () => 1)(elapsedTime),
                    ),
                  );

                  setOrigin(coordinates, newOrigin);

                  // cull once it's passed the camera, out past the play field,
                  // or drifted outside the visible frustum
                  return newOrigin[2] >= 0 ||
                    newOrigin[2] < -BULLET_MAX_RANGE ||
                    !isPointVisible(newOrigin);
                },
              ]] as ActionSchedule<Bullet>,
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
  bulletSound?.(getPanFromCoordinates(bulletObject[0], 5));

  return [
    bulletObject,
    createActionSequencer(bulletSchedule as ActionSchedule<Bullet>),
  ];
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
