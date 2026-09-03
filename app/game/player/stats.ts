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

import { min } from "~/alias";
import { doTimes, repeat } from "~/common";
import { Player } from "./types.ts";

export const updatePlayerSnapshots = (
  [ship, [armorLevels, fuelLevels = 0, shieldLevels = 0], inventory]: Player,
) => {
  const [, , weapons, , , _snapshot] = ship;
  const _weaponsSnapshots = doTimes(weapons, ([, , , , _s]) => _s);

  _snapshot[13] = doTimes(
    inventory,
    ([[, , , , , , mass], equipped]) => equipped ? mass : 0,
  ).reduce((sum, mass) => sum + mass, 0);

  doTimes(inventory, ([[, , , , , modifiers], equipped]) => {
    if (!equipped) return;
    doTimes(modifiers, ([statID, operator, value]) => {
      doTimes(
        (statID > 21 ? _weaponsSnapshots : [_snapshot]) as number[][],
        (target) => {
          operator == "x" ? target[statID] *= value : target[statID] += value;
        },
      );
    });
  });

  [ // TODO: need tiebreaker - is this by reference?
    armorLevels,
    fuelLevels,
    shieldLevels,
  ][
    [armorLevels, fuelLevels, shieldLevels].indexOf(
      min(armorLevels, fuelLevels, shieldLevels),
    )
  ] *= _snapshot[12];

  const levels = [
    armorLevels,
    ...repeat(3, fuelLevels),
    ...repeat(2, shieldLevels),
  ];

  doTimes(
    [0, 4, 7, 8, 15, 16],
    (id, index) => _snapshot[id] *= _snapshot[11] ** levels[index],
  );
};
