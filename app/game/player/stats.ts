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
import { length, min, round } from "~/alias";
import { doTimes, flat, repeat } from "~/common";

import GameOptions, { BASE_PROPERTIES } from "../options/module.ts";
import { ShipSnapshot, WeaponSnapshot } from "../ship/types.ts";
import { createWeapon } from "../ship/weapons.ts";

import { Item, Player } from "./types.ts";

export const updatePlayerEquipmentSnapshots = (
  [ship, [rezLevels, gasLevels, _, hpLevels], inventory]: Player,
) => {
  const _shipSnapshot = flat(BASE_PROPERTIES) as ShipSnapshot,
    equippedItems: (Item | undefined)[] = inventory.reduce(
      (slots, [item, equipped]) => (
        equipped && (slots[item[2]] = item), slots
      ),
      repeat(4, undefined) as (Item | undefined)[],
    ),
    _weaponsSnapshots = doTimes(
      2,
      (index: number) => {
        const item = equippedItems[index];

        if (!item) return BASE_PROPERTIES.slice(22);

        const _snapshot = createWeapon(item[3], index)[4];

        _snapshot[0] = item[7]![0];
        _snapshot[5] = item[7]![1];
        _snapshot[3] = item[7]![2];

        return _snapshot;
      },
    ) as [WeaponSnapshot, WeaponSnapshot],
    equippedItemObjects: XOObject[] = doTimes(
      GameOptions[0][2][0],
      (geometry) => createObject(...geometry, paint(0xFFFFFF)),
    );

  _shipSnapshot[13] = equippedItems.reduce(
    (sum: number, item) => sum + (item ? item[6] : 1), // +1kg for each empty equip slot
    0,
  );

  doTimes(equippedItems, (item) => {
    if (!item) return;

    const [, , , , , modifiers] = item;

    doTimes(modifiers, ([statID, operator, value]) => {
      const isWeaponStat = statID > 21,
        targetID = isWeaponStat ? statID - 22 : statID;

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
    const colorID = equippedItems[index]?.[3] ?? 0;

    equippedItemObjects[index] = createObject(
      ...GameOptions[0][2][0][index],
      paint(GameOptions[colorID][1]),
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

  let levels = [rezLevels, gasLevels, hpLevels];

  const minLevelIndicies = levels.reduce((arr, val) => {
    val == min(...levels) && arr.push(val);
    return arr;
  }, [] as number[]);

  if (length(minLevelIndicies) < 3) {
    doTimes(
      levels,
      (_, index) =>
        minLevelIndicies.includes(index) &&
        (levels[index] *= _shipSnapshot[12] / length(minLevelIndicies)),
    );
  }

  levels[
    levels.indexOf(
      min(rezLevels, gasLevels, hpLevels),
    )
  ] *= _shipSnapshot[12];

  levels = [
    levels[0],
    ...repeat(3, levels[1]),
    ...repeat(2, levels[2]),
  ];

  doTimes(
    [0, 4, 7, 8, 15, 16],
    (id, index) => _shipSnapshot[id] *= _shipSnapshot[11] ** levels[index],
  );

  // these are all discrete values - ensure int so HUD/state line up
  _shipSnapshot[0] = round(_shipSnapshot[0]);
  _shipSnapshot[4] = round(_shipSnapshot[4]);
  _shipSnapshot[8] = round(_shipSnapshot[8]);

  ship[5] = _shipSnapshot;
};
