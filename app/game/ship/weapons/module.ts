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

import { createObject, XOOrientation } from "~/3D";
import { NO_OP } from "~/alias";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { doTimes } from "~/common";

import GameOptions from "../../options/module.ts";
import { BASE_PROPERTIES } from "../../options/module.ts";
import { levelRollOverrides } from "../../world/levels.ts";
import { Ship, Weapon, WeaponSnapshot } from "../types.ts";
import { createBullet } from "./bullets.ts";

export const defaultWeaponSequenceFactory = (
  fire: (ship: Ship) => void,
  snapshot: WeaponSnapshot,
): ActionSequencer<Ship> =>
  createActionSequencer([
    [fire],
    [NO_OP, 1 / snapshot[5]],
  ]);

export const createWeapon = (
  optionsIndex: number,
  weaponIndex = 0,
  level = 1,
  mount = (GameOptions[optionsIndex][2][3][weaponIndex] ??
    GameOptions[optionsIndex][2][3][0])[2],
  snapshot = levelRollOverrides(
    BASE_PROPERTIES.slice(18),
    GameOptions[optionsIndex][2][3][0][0],
    level,
  ) as WeaponSnapshot,
  weaponSequenceFactory = (GameOptions[optionsIndex][2][3][weaponIndex] ??
    GameOptions[optionsIndex][2][3][0])[1] ??
    defaultWeaponSequenceFactory,
  sight = (GameOptions[optionsIndex][2][3][weaponIndex] ??
    GameOptions[optionsIndex][2][3][0])[4],
): Weapon => {
  const object = createObject([mount] as XOOrientation, sight?.[0], sight?.[1]);

  return [
    object,
    [[], []],
    weaponSequenceFactory(fireWeapon(weaponIndex), snapshot),
    snapshot,
    optionsIndex,
    object[0],
  ];
};

export const fireWeapon = (weaponIndex: number) => (ship: Ship) => {
  const [, , weapons, , resources, shipSnapshot] = ship,
    [, [bullets, instanceGroup], , snapshot] = weapons[weaponIndex];

  if (!ship[6]) {
    const totalGasUsed = resources[1] + shipSnapshot[9] * shipSnapshot[5];
    if (totalGasUsed >= shipSnapshot[4]) return;
    resources[1] = totalGasUsed;
  }

  doTimes(snapshot[0], () => {
    const bullet = createBullet(ship, weaponIndex);
    bullets.push(bullet);
    instanceGroup.push(bullet[0]);
  });
};
