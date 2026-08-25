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
import { ShipStatSnapshot, WeaponStatSnapshot } from "./types.ts";
import { SHIP_STAT_BASE, WEAPON_STAT_BASE } from "./constants.ts";
import { levelRoll } from "../world/waves.ts";

// TODO: dedupe as "createSnapshot"
export const createShipSnapshot = (
  [, , [, [shipOverrides]]]: ColorOptions,
  level = 1,
): ShipStatSnapshot => {
  const shipSnapshot = [...SHIP_STAT_BASE] as ShipStatSnapshot;

  for (const [statID, statBand] of shipOverrides) {
    shipSnapshot[statID] = levelRoll(statBand, level);
  }

  return shipSnapshot;
};

export const createWeaponSnapshot = (
  [, , [, [, weaponOverrides]]]: ColorOptions,
  level = 1,
) => {
  const shipSnapshot = [...WEAPON_STAT_BASE] as WeaponStatSnapshot;

  for (const [statID, statBand] of weaponOverrides) {
    shipSnapshot[statID] = levelRoll(statBand, level);
  }

  return shipSnapshot;
};
