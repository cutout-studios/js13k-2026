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

import { createObject, flattenObjects, XOObject, XYZ } from "~/3D";
import { createActionSequence } from "~/clock";

import { ColorOptions } from "../options/types.ts";
import { levelRollOverrides } from "../world/levels.ts";
import { Resources, Ship, ShipSnapshot } from "./types.ts";
import { _THREE_ZEROS, SHIP_BASE_PROPERTIES } from "./constants.ts";
import { createWeapon } from "./weapons.ts";

export const createShip = (
  [
    ,
    ,
    [shapes, shipOverrides, shipSchedule, weapon],
  ]: ColorOptions,
  level = 1,
): Ship => [
  flattenObjects(...shapes.map((args) => createObject(...args))),
  _THREE_ZEROS() as XYZ,
  [createWeapon(weapon, level)],
  createActionSequence(shipSchedule),
  _THREE_ZEROS() as Resources,
  levelRollOverrides(
    SHIP_BASE_PROPERTIES,
    shipOverrides,
    level,
  ) as ShipSnapshot,
];

export const getShipObjects = (
  [shipObject, , weapons]: Ship,
): XOObject[][] => [
  [shipObject],
  ...weapons.map(([, , [, bullets]]) => bullets),
];
