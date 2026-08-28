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

import { doTimes, repeat } from "~/common";
import {
  aimObject,
  createObject,
  createPaintMaterialWithPalette as paint,
  flattenObjects,
  XOObject,
  XYZ,
} from "~/3D";
import { ActionSchedule, createActionSequencer } from "~/clock";

import { ColorOptions } from "../options/types.ts";
import { levelRollOverrides } from "../world/levels.ts";
import { Resources, Ship, ShipSnapshot } from "./types.ts";
import { updateBullets } from "./bullets.ts";
import { SHIP_BASE_PROPERTIES } from "./constants.ts";
import { createWeapon } from "./weapons.ts";

export const advanceShip = (ship: Ship, tickLength: number) => {
  aimObject(ship[0], ship[1]);
  updateBullets(ship, tickLength);
};

export const createShip = (
  options: ColorOptions,
  level = 1,
): Ship => {
  const [
    ,
    value,
    [
      shapes,
      shipOverrides,
      shipSchedule = [[(ship: Ship, tickLength: number) => {
        advanceShip(ship, tickLength);
        doTimes(ship[2], (weapon) => weapon[3](ship, tickLength));
      }]] as ActionSchedule<Ship>,
    ],
  ] = options;

  return [
    flattenObjects(
      ...shapes.map((args) => createObject(...args, paint(value))),
    ),
    repeat(3, 0) as XYZ,
    [createWeapon(options, level, 0)],
    createActionSequencer(shipSchedule),
    repeat(5, 0) as Resources,
    levelRollOverrides(
      SHIP_BASE_PROPERTIES,
      shipOverrides,
      level,
    ) as ShipSnapshot,
    options,
  ];
};

export const getShipObjects = (
  [shipObject, , weapons]: Ship,
): XOObject[][] => [
  [shipObject],
  ...weapons.map(([, , [, bullets]]) => bullets),
];
