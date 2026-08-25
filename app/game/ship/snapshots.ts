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

import { ColorOptions } from "../options/types.ts";
import { ShipSnapshot, WeaponSnapshot } from "./types.ts";
import { SHIP_BASE_PROPERTIES, WEAPON_BASE_PROPERTIES } from "./constants.ts";
import { levelRoll } from "../world/waves.ts";
import { doTimes } from "~/common";

export const createSnapshot = (
  [, , [, overrides]]: ColorOptions,
  level = 1,
): [ShipSnapshot, WeaponSnapshot] => {
  const result = [SHIP_BASE_PROPERTIES(), WEAPON_BASE_PROPERTIES()] as [
    ShipSnapshot,
    WeaponSnapshot,
  ];

  doTimes(2, (index) => {
    for (const [statID, statBand] of overrides[index]) {
      result[index][statID] = levelRoll(statBand, level);
    }
  });

  return result;
};
