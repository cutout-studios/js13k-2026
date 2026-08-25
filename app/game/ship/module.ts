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

import { XOObject } from "~/3D";

import { Ship } from "./types.ts";

export const createShip = (options: ColorOptions, level = 1): Ship => {
  const result = [SHIP_BASE_PROPERTIES(), WEAPON_BASE_PROPERTIES()] as [
    ShipSnapshot,
    WeaponSnapshot,
  ];

  doTimes(2, (index) => {
    for (const [statID, statBand] of overrides[index]) {
      result[index][statID] = levelRoll(statBand, level);
    }
  });
};

export const getShipObjects = (
  [shipObject, , weapons]: Ship,
): [ship: XOObject[], ...bulletGroups: XOObject[][]] => [
  [shipObject],
  ...weapons.map(([, , [, bullets]]) => bullets),
];
