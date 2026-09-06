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

import { scatterObjects } from "~/3D";
import { length, max, min, round } from "~/alias";
import { doTimes, spread } from "~/common";

import { createDeck, drawCard } from "../decks.ts";
import GameOptions, {
  ENEMY_Z_PLANE,
  FIELD_X_BOUND,
  FIELD_Y_BOUND,
} from "../options/module.ts";
import { createShip } from "../ship/module.ts";

import { GROUPS_PER_WAVE_BAND, WAVE_CURVE, WAVE_PACING } from "./constants.ts";
import { levelCurve, levelRoll } from "./levels.ts";
import { EnemyGroup } from "./types.ts";

export const rollEnemies = (wave: number, level: number) =>
  doTimes(
    round(
      min(
        GROUPS_PER_WAVE_BAND[1],
        max(
          GROUPS_PER_WAVE_BAND[0],
          WAVE_PACING[wave % length(WAVE_PACING)] *
            levelCurve(level) * WAVE_CURVE,
        ),
      ),
    ),
    (index: number) =>
      _drawEnemyGroup(drawCard(_enemyDeck) + 1, level, index % 2 ? 1 : -1),
  );

const _enemyDeck = createDeck(length(GameOptions.slice(1)));
const _drawEnemyGroup = (
  optionsIndex: number,
  level: number,
  side: number = -1,
): EnemyGroup => {
  const count = round(levelRoll(GameOptions[optionsIndex][2][4], level)),
    ships = doTimes(count, () => createShip(optionsIndex, level)),
    shipObjects = doTimes(ships, (ship) => ship[0]);

  scatterObjects(
    [
      spread(FIELD_X_BOUND, 2 * side * FIELD_X_BOUND),
      spread(FIELD_Y_BOUND),
      spread(0.5, -ENEMY_Z_PLANE),
    ],
    true,
    ...shipObjects,
  );

  return [ships, shipObjects];
};
