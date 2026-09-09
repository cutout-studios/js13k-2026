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
  XOObject,
  XYZ,
} from "~/3D";
import { length, NO_OP } from "~/alias";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { Band, doTimes, flat, repeat } from "~/common";

import { BASE_PROPERTIES } from "../options/module.ts";
import GameOptions from "../options/module.ts";
import { levelRollOverrides } from "../world/levels.ts";

import { Resources, Ship, ShipSnapshot } from "./types.ts";
import { createWeapon } from "./weapons/module.ts";

export const createShip = (
  optionsIndex: number,
  level = 1,
  // only meaningful to schedules that accept it (currently just pink) - see
  // options/types.ts's sequenceFactory signature. rollEnemies passes the
  // group's own spawn region through here so ships in the same group draw
  // their orbit reference point from the same neighborhood
  arcPoint?: [Band, Band, Band],
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
      ...shapes.map((args) => createObject(...args, paint(value))),
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
  ];

  // deferred to the ship's first real tick, which by then always happens
  // after the caller (rollEnemies' scatterObjects, sandbox's spawnShip) has
  // actually placed it - schedules that snapshot their own starting point
  // at creation time (readOrigin) would otherwise capture the object's
  // default origin of [0,0,0] instead of the real spawn point
  let sequencer: ActionSequencer<Ship> | undefined;
  ship[3] = (payload, tickLength) =>
    (sequencer ??= shipSequencerFactory(ship, arcPoint))(payload, tickLength);

  return ship;
};

export const getShipObjects = (
  [shipObject, , weapons]: Ship,
): XOObject[][] =>
  flat(
    [[shipObject]],
    doTimes(weapons, ([, [, bullets]]) => bullets),
  );

// export const createFlinchSequencer = () => {};
