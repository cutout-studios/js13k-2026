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
import { min } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { doTimes, flat, spliceTable } from "~/common";
import { rollSpread } from "~/random";

import GameOptions, {
  BULLET_ALPHA,
  BULLET_SPEED,
  ENEMY_BULLET_RAMP_TIME,
} from "../options/module.ts";

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
                  [[coordinates], , lifetime]: Bullet,
                  tickLength: number,
                  elapsedTime: number,
                ) => {
                  if (elapsedTime >= lifetime) return true;

                  setOrigin(
                    coordinates,
                    addXYZ(
                      readOrigin(coordinates),
                      scaleXYZ(
                        readHeading(coordinates),
                        tickLength * BULLET_SPEED *
                          (shipOptionsIndex
                            ? (elapsedTime: number) =>
                              min(1, elapsedTime / ENEMY_BULLET_RAMP_TIME)
                            : () => 1)(elapsedTime),
                      ),
                    ),
                  );
                },
              ]] as ActionSchedule<Bullet>,
            ] = [],
          ],
        ],
      ],
    ] = GameOptions[optionsIndex],
    globalCoordinates = localize(mountCoordinates, shipCoordinates),
    globalOrigin = readOrigin(globalCoordinates),
    globalHeading = readOrigin(
      localize(
        setOrigin(createCoordinates(), [
          -rollSpread(snapshot[6]),
          -rollSpread(snapshot[6]),
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
  bulletSound(getPanFromCoordinates(bulletObject[0], 5));

  return [
    bulletObject,
    createActionSequencer(bulletSchedule as ActionSchedule<Bullet>),
    snapshot[4],
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
