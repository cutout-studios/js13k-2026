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

import { length, min } from "~/alias";
import { doTimes, repeat } from "~/common";
import { Player } from "./types.ts";

export const updatePlayerSnapshots = (
  [ship, [rezLevels, gasLevels, _, hpLevels], inventory]: Player,
) => {
  const [, , weapons, , , _snapshot] = ship;
  const _weaponsSnapshots = doTimes(weapons, ([, , , , _s]) => _s);

  _snapshot[13] = doTimes(
    inventory,
    ([[, , , , , , kg], equipped]) => equipped ? kg : 0,
  ).reduce((sum, kg) => sum + kg, 0);

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
};
