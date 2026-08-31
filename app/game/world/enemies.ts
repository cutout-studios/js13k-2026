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

import { setOrigin, XYZ } from "~/3D";
import { length, max, min, round } from "~/alias";
import { doTimes } from "~/common";
import { range } from "~/random";
import { createDeck, drawCard } from "../decks.ts";
import GameOptions from "../options/module.ts";
import { createShip } from "../ship/module.ts";
import {
  ENEMY_PLACEMENT_SPREAD,
  ENEMY_Z_PLANE,
  GROUPS_PER_WAVE_BAND,
  WAVE_CURVE,
  WAVE_PACING,
} from "./constants.ts";
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
    () => _drawEnemyGroup(drawCard(_enemyDeck) + 1, level),
  );

const _enemyDeck = createDeck(length(GameOptions.slice(1)));
const _drawEnemyGroup = (
  optionsIndex: number,
  level: number,
): EnemyGroup => {
  const [, , [shapes, , , , countBand]] = GameOptions[optionsIndex];
  const count = round(levelRoll(countBand, level)),
    spawnQuadrantSize = min(
      3.5,
      (max(...doTimes(shapes, ([, [scale]]) => scale)) * count *
        ENEMY_PLACEMENT_SPREAD) / 2,
    );

  const ships = doTimes(count, () => {
    const ship = createShip(optionsIndex, level);

    ship[0][0] = setOrigin(ship[0][0], [
      ...doTimes(2, () => range(-spawnQuadrantSize, spawnQuadrantSize)),
      -ENEMY_Z_PLANE,
    ] as XYZ);

    return ship;
  });

  return [
    ships,
    doTimes(ships, ([object]) => object),
  ];
};
