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
  readOrigin,
  scaleXYZ,
  subtractXYZ,
  XOObject,
  XYZ,
} from "~/3D";
import { length } from "~/alias";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { doTimes, flat, repeat, spread } from "~/common";

import { createPull } from "../actions.ts";
import GameState from "../module.ts";
import {
  BASE_PROPERTIES,
  ENEMY_X_BOUND,
  PLAYER_X_BOUND,
} from "../options/module.ts";
import GameOptions from "../options/module.ts";
import { levelRollOverrides } from "../world/levels.ts";

import { updateBullets } from "./bullets.ts";
import { Resources, Ship, ShipSnapshot } from "./types.ts";
import { createWeapon } from "./weapons.ts";

const pullTracker = new WeakMap(),
  [pullLeft, pullRight] = doTimes(
    spread(PLAYER_X_BOUND) as [lo: number, hi: number],
    (bound) =>
      createPull([bound, 0, 0], 0.01, () => 1, [[0, 0.02], [0, 0.005], [0, 0]]),
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
        const [shipObject, shipAim, weapons, , , snapshot] = ship,
          shipX = readOrigin(shipObject[0])[0];

        if (shipX > ENEMY_X_BOUND || !pullTracker.has(ship)) {
          pullTracker.set(ship, pullLeft);
        } else if (shipX < -ENEMY_X_BOUND) {
          pullTracker.set(ship, pullRight);
        }

        pullTracker.get(ship)!(shipObject, tickLength, ...args);

        const [x, y] = scaleXYZ(
          subtractXYZ(readOrigin(GameState[0][0][0][0]), shipAim),
          tickLength / snapshot[17],
        );

        shipAim[0] += x;
        shipAim[1] += y;

        aimObject(shipObject, shipAim);

        if (shipX < ENEMY_X_BOUND && shipX > -ENEMY_X_BOUND) {
          doTimes(weapons, (weapon) => weapon[2](ship, tickLength));
        }
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
    repeat(6, 0) as Resources,
    levelRollOverrides(
      BASE_PROPERTIES,
      shipOverrides,
      level,
    ) as ShipSnapshot,
    optionsIndex,
  ];
};

// export const createFlinchSequencer = () => {};

export const getShipObjects = (
  [shipObject, , weapons]: Ship,
): XOObject[][] =>
  flat(
    [[shipObject]],
    doTimes(weapons, ([, [, bullets]]) => bullets),
  );
