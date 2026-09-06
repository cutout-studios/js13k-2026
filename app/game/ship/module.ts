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
  aimObject,
  createObject,
  createPaintMaterialWithPalette as paint,
  flattenObjects,
  XOObject,
  XYZ,
} from "~/3D";
import { floor, length } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { doTimes, flat, repeat, spread } from "~/common";

import { createPull } from "../actions.ts";
import {
  BASE_PROPERTIES,
  ENEMY_Z_PLANE,
  FIELD_X_BOUND,
} from "../options/module.ts";
import GameOptions from "../options/module.ts";
import { levelRollOverrides } from "../world/levels.ts";

import { updateBullets } from "./bullets.ts";
import { Resources, Ship, ShipSnapshot } from "./types.ts";
import { createWeapon } from "./weapons.ts";

const pullTracker = new WeakMap(), [pullLeft, pullRight] = doTimes(
  spread(FIELD_X_BOUND) as [lo: number, hi: number],
  (bound) => createPull([bound, 0, ENEMY_Z_PLANE], 1, () => 1, 0.7),
);

export const createShip = (
  optionsIndex: number,
  level = 1,
): Ship => {
  const [
    ,
    value,
    [
      shapes,
      shipOverrides,
      shipSchedule = [[(ship: Ship, tickLength: number, ...args) => {
        const horizontalPosition = getPanFromCoordinates(ship[0][0], FIELD_X_BOUND);
        if (horizontalPosition == -1 || !pullTracker.has(ship)) {
          pullTracker.set(ship, pullRight);
        } else if (horizontalPosition == 1) {
          pullTracker.set(ship, pullLeft);
        }

        pullTracker.get(ship)!(ship[0], tickLength, ...args);

        aimObject(ship[0], ship[1]);

        doTimes(ship[2], (weapon) => weapon[3](ship, tickLength));
        updateBullets(ship, tickLength);
      }]] as ActionSchedule<Ship>,
      shipWeapons,
    ],
  ] = GameOptions[optionsIndex];

  return [
    flattenObjects(
      ...shapes.map((args) => createObject(...args, paint(value))),
    ),
    repeat(3, 0) as XYZ,
    doTimes(
      length(shipWeapons),
      (weaponIndex: number) => createWeapon(optionsIndex, weaponIndex, level),
    ),
    createActionSequencer(shipSchedule),
    repeat(8, 0) as Resources,
    levelRollOverrides(
      BASE_PROPERTIES,
      shipOverrides,
      level,
    ) as ShipSnapshot,
    optionsIndex,
  ];
};

// export const createFlinchSequencer = () => {};

export const consumeFuel = (
  amount: number,
  [, , , , resources, snapshot]: Ship,
): boolean => {
  const gasConsumed = amount + resources[1] + resources[2] * snapshot[4];

  if (gasConsumed >= snapshot[4] * snapshot[8]) return false;

  resources[1] = gasConsumed % snapshot[4];
  resources[2] = floor(gasConsumed / snapshot[4]);

  return true;
};

export const getShipObjects = (
  [shipObject, , weapons]: Ship,
): XOObject[][] =>
  flat(
    [[shipObject]],
    doTimes(weapons, ([, , [, bullets]]) => bullets),
  );
