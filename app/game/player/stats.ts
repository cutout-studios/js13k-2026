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
} from "~/3D";
import { round } from "~/alias";
import { doTimes, flat, sum } from "~/common";

import { BASE_PROPERTIES } from "../options/base.ts";
import GameOptions from "../options/module.ts";
import { ShipSnapshot, WeaponSnapshot } from "../ship/types.ts";
import { createWeapon } from "../ship/weapons.ts";

import { Player } from "./types.ts";

export const updatePlayerEquipmentSnapshots = (
  [ship, equippedItems]: Player,
) => {
  const _shipSnapshot = flat(BASE_PROPERTIES) as ShipSnapshot,
    _weaponsSnapshots = doTimes(
      2,
      (index: number) => {
        const item = equippedItems[index];

        if (!item) return BASE_PROPERTIES.slice(18);

        const _snapshot = createWeapon(item[3], index)[3];

        _snapshot[0] = item[7]![0];
        _snapshot[5] = item[7]![1];
        _snapshot[3] = item[7]![2];
        _snapshot[7] = item[6];

        return _snapshot;
      },
    ) as [WeaponSnapshot, WeaponSnapshot],
    equippedItemObjects: XOObject[] = doTimes(
      GameOptions[0][2][0],
      ([orientation, geometry, material]) =>
        createObject(orientation, geometry, (material ?? paint)(0xFFFFFFFF)),
    );

  // +1kg per default item
  _shipSnapshot[9] = sum(doTimes(equippedItems, (item) => item ? item[6] : 1));

  doTimes(equippedItems, (item) => {
    if (!item) return;

    const [, , , , , modifiers] = item;

    doTimes(modifiers, ([statID, operator, value]) => {
      const isWeaponStat = statID > 17,
        targetID = isWeaponStat ? statID - 18 : statID;

      doTimes(
        (isWeaponStat ? _weaponsSnapshots : [_shipSnapshot]) as number[][],
        (target) => {
          operator == "x"
            ? target[targetID] *= value
            : target[targetID] += value;
        },
      );
    });
  });

  doTimes(4, (index: number) => {
    const colorID = equippedItems[index]?.[3] ?? 0,
      [orientation, geometry, material] = GameOptions[0][2][0][index];

    equippedItemObjects[index] = createObject(
      orientation,
      geometry,
      (material ?? paint)(GameOptions[colorID][1]),
    );

    if (index > 1) return; // only WING (L)/WING (R) slots carry a weapon

    const weapon = ship[2][index],
      newWeapon = createWeapon(
        colorID,
        index,
        1,
        GameOptions[0][2][3][index][2],
        _weaponsSnapshots[index],
      );

    doTimes(newWeapon, (value, fieldIndex) => weapon[fieldIndex] = value);
  });

  const [, newGeometry, newMaterial] = flattenObjects(...equippedItemObjects);
  ship[0][1] = newGeometry;
  ship[0][2] = newMaterial;

  // discrete value - ensure int so HUD/state line up
  _shipSnapshot[0] = round(_shipSnapshot[0]);

  ship[5] = _shipSnapshot;
};
