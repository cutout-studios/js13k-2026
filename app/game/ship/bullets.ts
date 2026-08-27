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
  readOrigin,
  scaleXYZ,
  setOrigin,
  XOGeometry,
  XYZ,
} from "~/3D";
import { ActionSchedule, createActionSequencer } from "~/clock";

import { ColorOptions } from "../options/types.ts";
import { Bullet, Ship } from "./types.ts";

import { BULLET_SPEED } from "./constants.ts";

export const createBullet = (
  [, value, [, , , [
    ,
    ,
    bulletGeometry = [
      0.06,
      createPrism([0.015, 0.015, 0.14], 4),
    ] as XOGeometry,
    ,
    bulletSchedule = [[moveBullet]] as ActionSchedule<Bullet>,
  ]]]: ColorOptions,
  origin: XYZ,
  direction: XYZ,
): Bullet => {
  const object = createObject([origin], bulletGeometry, paint(value));

  aimObject(object, addXYZ(origin, direction));

  return [object, createActionSequencer(bulletSchedule), direction];
};

export const moveBullet = (
  [[coordinates], , direction]: Bullet,
  tickLength: number,
  elapsedTime: number,
  currentDuration: number,
) => {
  if (elapsedTime >= currentDuration) return true;

  setOrigin(
    coordinates,
    addXYZ(
      readOrigin(coordinates),
      scaleXYZ(direction, tickLength * BULLET_SPEED),
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
      ) => (bullet[1](bullet, tickLength) && bulletsToCull.push(index)),
    );

    spliceTable(bullets, bulletsToCull);
  });
