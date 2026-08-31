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

import { doTimes, repeat } from "~/common";
import { Player } from "./types.ts";

export const updatePlayerSnapshots = (
  [ship, [shieldLevels, fuelLevels = 0, , armorLevels = 0], inventory]: Player,
) => {
  const [, , weapons, , , _snapshot] = ship;
  const _weaponsSnapshots = doTimes(weapons, ([, , , , _s]) => _s);

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
