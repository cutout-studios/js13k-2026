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

import { createObject, XOGeometry, XOMaterial, XOOrientation, XYZ } from "~/3D";
import { ActionSequencer } from "~/clock";
import { doTimes } from "~/common";

import { BASE_PROPERTIES } from "../options/base.ts";
import GameOptions from "../options/module.ts";
import { levelRollOverrides } from "../world/levels.ts";
import { createBullet } from "./bullets.ts";
import { Ship, Weapon, WeaponSnapshot } from "./types.ts";

export const createWeapon = (
  optionsIndex: number,
  weaponIndex = 0,
  level = 1,
  mount?: XYZ,
  snapshot?: WeaponSnapshot,
  weaponSequenceFactory?: (
    fire: (ship: Ship) => void,
    snapshot: WeaponSnapshot,
  ) => ActionSequencer<Ship>,
  sight?: [XOGeometry, XOMaterial?],
): Weapon => {
  const weaponConfig = GameOptions[optionsIndex][2][3][weaponIndex] ??
    GameOptions[optionsIndex][2][3][0];
  mount ??= weaponConfig[2];
  snapshot ??= levelRollOverrides(
    BASE_PROPERTIES.slice(18),
    weaponConfig[0],
    level,
  ) as WeaponSnapshot;
  weaponSequenceFactory ??= weaponConfig[1];
  sight ??= weaponConfig[4];

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

export const canAffordWeapon = (ship: Ship, weaponIndex: number) => {
  const [, , weapons, , resources, shipSnapshot] = ship;
  return !!ship[6] ||
    resources[1] + weapons[weaponIndex][3][7] * shipSnapshot[5] <
      shipSnapshot[4];
};

export const fireWeapon = (weaponIndex: number) => (ship: Ship) => {
  const [, , weapons, , resources, shipSnapshot] = ship,
    [, [bullets, instanceGroup], , snapshot] = weapons[weaponIndex];

  if (!canAffordWeapon(ship, weaponIndex)) return;
  if (!ship[6]) resources[1] += snapshot[7] * shipSnapshot[5];

  doTimes(snapshot[0], () => {
    const bullet = createBullet(ship, weaponIndex);
    bullets.push(bullet);
    instanceGroup.push(bullet[0]);
  });
};
