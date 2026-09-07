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
  ENEMY_X_BOUND,
  ENEMY_Y_BOUND,
  ENEMY_Z_PLANE,
} from "../options/module.ts";
import { createShip } from "../ship/module.ts";
import { Ship } from "../ship/types.ts";

import { GROUPS_PER_WAVE_BAND, WAVE_CURVE, WAVE_PACING } from "./constants.ts";
import { levelCurve, levelRoll } from "./levels.ts";

const _enemyDeck = createDeck(length(GameOptions.slice(1)));

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
    (index: number): Ship[] => {
      const optionsIndex = drawCard(_enemyDeck) + 1,
        side = index % 2 ? 1 : -1,
        count = round(levelRoll(GameOptions[optionsIndex][2][4], level)),
        ships = doTimes(count, () => createShip(optionsIndex, level));

      scatterObjects(
        [
          spread(ENEMY_X_BOUND, 2 * side * ENEMY_X_BOUND),
          spread(ENEMY_Y_BOUND),
          spread(1, -ENEMY_Z_PLANE),
        ],
        true,
        ...doTimes(ships, (ship) => ship[0]),
      );

      return ships;
    },
  );
