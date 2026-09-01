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

import { createObject, XOOrientation, XYZ, Z_AXIS } from "~/3D";
import { NO_OP } from "~/alias";
import { createActionSequencer } from "~/clock";
import { doTimes } from "~/common";

import GameOptions from "../options/module.ts";
import { WEAPON_BASE_PROPERTIES } from "../options/module.ts";
import { levelRollOverrides } from "../world/levels.ts";
import { createBullet } from "./bullets.ts";
import { Ship, Weapon, WeaponSnapshot } from "./types.ts";

export const createWeapon = (
  optionsIndex: number,
  weaponIndex = 0,
  level = 1,
): Weapon => {
  const [, , [, , , weapons]] = GameOptions[optionsIndex],
    [overrides, schedule, mount = [0, 0, 0] as XYZ] = weapons[weaponIndex],
    snapshot = levelRollOverrides(
      WEAPON_BASE_PROPERTIES,
      overrides,
      level,
    ) as WeaponSnapshot;

  return [
    createObject([mount] as XOOrientation),
    Z_AXIS,
    [[], []],
    createActionSequencer(
      schedule ?? [
        [fireWeapon(weaponIndex)],
        [NO_OP, 1 / snapshot[5]],
      ],
    ),
    snapshot,
  ];
};

// TEMP: fuel consumption
const FUEL_PER_SHOT = 1.5;

export const fireWeapon = (weaponIndex: number) => (ship: Ship) => {
  const [, , weapons, , damages, shipSnapshot] = ship,
    [, , [bullets, instanceGroup], , snapshot] = weapons[weaponIndex],
    [count] = snapshot,
    fuelUsed = (damages[1] || 0) + FUEL_PER_SHOT;

  // TEMP: fuel consumption
  if (ship[6] == 0 && fuelUsed > shipSnapshot[4]) return;

  damages[1] = fuelUsed;
  doTimes(count, () => {
    const bullet = createBullet(ship, weaponIndex);
    bullets.push(bullet);
    instanceGroup.push(bullet[0]);
  });
};
