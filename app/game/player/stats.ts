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

import { Player } from "./types.ts";
import { repeat } from "~/common";

export const updatePlayerSnapshots = (
  [ship, [shieldLevels, fuelLevels = 0, , armorLevels = 0], inventory]: Player,
) => {
  const [, , weapons, , , _snapshot] = ship;
  const _weaponsSnapshots = weapons.map(([, , , , _s]) => _s);

  // TOOD: compute mass, weapons

  for (const [[, , , , , modifiers], equipped] of inventory) {
    if (!equipped) continue;

    for (const [statID, operator, value] of modifiers) {
      const targets = statID > 21 ? _weaponsSnapshots : [_snapshot];

      for (const target of targets) {
        operator === "*" ? target[statID] *= value : target[statID] += value;
      }
    }
  }

  const levels = [
    armorLevels,
    ...repeat(3, fuelLevels),
    ...repeat(2, shieldLevels),
  ];

  [0, 4, 7, 8, 15, 16].forEach((id, index) =>
    _snapshot[id] *= _snapshot[11] ** levels[index]
  );

  // TODO: lowestResource
};
