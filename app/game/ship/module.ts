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
  createObject,
  createPaintMaterialWithPalette as paint,
  flattenObjects,
  localize,
  XOObject,
  XYZ,
} from "~/3D";
import { length, NO_OP } from "~/alias";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { doTimes, flat, repeat } from "~/common";

import { BASE_PROPERTIES, ENEMY_FADE_TIME } from "../options/base.ts";
import GameOptions from "../options/module.ts";
import { levelRollOverrides } from "../world/levels.ts";

import { Resources, Ship, ShipSnapshot } from "./types.ts";
import { createWeapon } from "./weapons.ts";

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
      shipSequencerFactory,
      shipWeapons,
    ],
  ] = GameOptions[optionsIndex];

  const ship: Ship = [
    flattenObjects(
      ...shapes.map(([orientation, geometry, material]) =>
        createObject(orientation, geometry, (material ?? paint)(value))
      ),
    ),
    repeat(3, 0) as XYZ,
    doTimes(
      length(shipWeapons),
      (weaponIndex: number) => createWeapon(optionsIndex, weaponIndex, level),
    ),
    createActionSequencer([[NO_OP]]),
    repeat(7, 0) as Resources,
    levelRollOverrides(
      BASE_PROPERTIES,
      shipOverrides,
      level,
    ) as ShipSnapshot,
    optionsIndex,
    [[], []],
  ];

  let sequencer: ActionSequencer<Ship> | undefined;
  ship[3] = (payload, tickLength) =>
    (sequencer ??= shipSequencerFactory(ship))(payload, tickLength);

  return ship;
};

export const updateWeaponMounts = (ship: Ship) =>
  doTimes(
    ship[2],
    ([object, , , , , localMount]) =>
      localMount && (object[0] = localize(localMount, ship[0][0])),
  );

export const getShipObjects = (
  [shipObject, , weapons, , damages, , optionsIndex, auxiliaryBullets]: Ship,
): XOObject[][] =>
  flat(
    optionsIndex && damages[3] > ENEMY_FADE_TIME
      ? []
      : flat([[shipObject]], doTimes(weapons, ([object]) => [object])),
    doTimes(weapons, ([, [, bullets]]) => bullets),
    [auxiliaryBullets[1]],
  );
