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
  localize,
  XOObject,
} from "~/3D";
import { length, min, round } from "~/alias";
import { doTimes, flatDoTimes, repeat } from "~/common";

import GameOptions, { BASE_PROPERTIES } from "../options/module.ts";
import { WeaponSnapshot } from "../ship/types.ts";

import { Item, Player } from "./types.ts";

export const updatePlayerEquipmentSnapshots = (
  [ship, [rezLevels, gasLevels, _, hpLevels], inventory]: Player,
) => {
  const [, , weapons, , , _snapshot] = ship;
  const equipList: Item[] = flatDoTimes(
    inventory,
    ([item, equipped]) => equipped ? [item] : [],
  );

  _snapshot[13] = equipList.reduce(
    (sum: number, item: Item) => sum + item[6],
    4 - equipList.length, // +1kg for each empty equip slot
  );

  const _weaponsSnapshots: number[][] = [],
    shipObjects: XOObject[] = doTimes(
      GameOptions[0][2][0],
      (itemGeo) => createObject(...itemGeo, paint(0xFFFFFF)),
    );

  doTimes(
    equipList,
    ([, , typeID, colorID, , , , [amount = 1, rate = 8, damage = 1] = []]) => {
      shipObjects[typeID] = createObject(
        ...GameOptions[0][2][0][typeID],
        paint(GameOptions[colorID][1]),
      );

      if (typeID > 1) return;

      weapons[typeID][4] = BASE_PROPERTIES.slice(22) as WeaponSnapshot;

      weapons[typeID][4][0] = amount;
      weapons[typeID][4][3] = damage;
      weapons[typeID][4][5] = rate;

      _weaponsSnapshots.push(weapons[typeID][4]);
    },
  );

  const newShipObject = flattenObjects(...shipObjects);

  newShipObject[0] = localize(newShipObject[0], ship[0][0]);

  ship[0] = newShipObject;

  doTimes(equipList, ([, , , , , modifiers]) => {
    doTimes(modifiers, ([statID, operator, value]) => {
      doTimes(
        (statID > 21 ? _weaponsSnapshots : [_snapshot]) as number[][],
        (target) => {
          operator == "x" ? target[statID] *= value : target[statID] += value;
        },
      );
    });
  });

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
        (levels[index] *= _snapshot[12] / length(minLevelIndicies)),
    );
  }

  levels[
    levels.indexOf(
      min(rezLevels, gasLevels, hpLevels),
    )
  ] *= _snapshot[12];

  levels = [
    levels[0],
    ...repeat(3, levels[1]),
    ...repeat(2, levels[2]),
  ];

  doTimes(
    [0, 4, 7, 8, 15, 16],
    (id, index) => _snapshot[id] *= _snapshot[11] ** levels[index],
  );

  // these values need to be ints
  _snapshot[0] = round(_snapshot[0]);
  _snapshot[4] = round(_snapshot[4]);
};
