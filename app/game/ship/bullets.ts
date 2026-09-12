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
  readOrigin,
  setOrigin,
  subtractXYZ,
  XOGeometry,
} from "~/3D";
import { max, NO_OP, round } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { createActionSequencer } from "~/clock";
import { doTimes, spliceTable } from "~/common";
import { rollSpread } from "~/random";

import { BULLET_ALPHA } from "../options/base.ts";
import GameOptions from "../options/module.ts";
import { Bullet, BulletGroup, Ship } from "./types.ts";

export const createBullet = (
  ship: Ship,
  weaponIndex: number,
): Bullet => {
  const [
      ,
      ,
      weapons,
      ,
      ,
      ,
      shipOptionsIndex,
    ] = ship,
    [
      [globalCoordinates],
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
        weaponConfigs,
      ],
    ] = GameOptions[optionsIndex],
    [
      ,
      ,
      ,
      [
        bulletGeometry,
        bulletSequencerFactory,
        bulletSound,
      ] = [],
    ] = weaponConfigs[optionsIndex == shipOptionsIndex ? weaponIndex : 0],
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
  );

  const bullet: Bullet = [
    bulletObject,
    createActionSequencer([[NO_OP]]),
    ship,
    weaponIndex,
  ];
  bullet[1] = bulletSequencerFactory!(
    bullet,
    snapshot[4],
    !!shipOptionsIndex,
  );

  return bullet;
};

const updateBulletGroup = (bullets: BulletGroup, tickLength: number) => {
  const bulletsToCull = [] as number[];

  doTimes(
    bullets[0],
    (
      bullet: Bullet,
      index: number,
    ) => bullet[1](bullet, tickLength) && bulletsToCull.push(index),
  );

  spliceTable(bullets, bulletsToCull);
};

export const updateBullets = (ship: Ship, tickLength: number) => {
  ship[2].forEach(([, bullets]) => updateBulletGroup(bullets, tickLength));
  updateBulletGroup(ship[7], tickLength);
};
