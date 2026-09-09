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
import { Band, doTimes, spread } from "~/common";

import { visibleHalfExtentAt } from "../../elements/mainCanvas.ts";

import { PLAYER_AIM_Z_PLANE } from "../constants.ts";
import { createDeck, drawCard } from "../decks.ts";
import GameOptions from "../options/module.ts";
import { createShip } from "../ship/module.ts";
import { Ship } from "../ship/types.ts";

import { GROUPS_PER_WAVE_BAND, WAVE_CURVE, WAVE_PACING } from "./constants.ts";
import { levelCurve, levelRoll } from "./levels.ts";

// enemies spawn closer than the aim plane, so size the frustum for the
// depth they'll actually be placed at rather than PLAYER_AIM_Z_PLANE itself
const SPAWN_Z = PLAYER_AIM_Z_PLANE - 2;
const [visibleX, visibleY] = visibleHalfExtentAt(SPAWN_Z);

const _enemyDeck = createDeck(length(GameOptions.slice(1)));
const _spawnRegionDeck: [Band, Band, Band][] = doTimes(
  [[-1, 1], [1, 1], [
    1,
    -1,
  ], [-1, -1]],
  (
    [x, y],
  ) => [
    // just outside the visible edge (~1.2x out, ±0.25x wide) rather than
    // 1.5-2.5x out - slow ships were taking forever to travel in from there
    spread(visibleX * 0.25, x * 1.2 * visibleX),
    spread(visibleY * 0.25, y * 1.2 * visibleY),
    spread(1, -SPAWN_Z),
  ],
);

_spawnRegionDeck.push([spread(1, 0), spread(1, 0), spread(1, 3)]);

export const rollEnemies = (
  wave: number,
  level: number,
) =>
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
    (): Ship[] => {
      const optionsIndex = drawCard(_enemyDeck) + 1,
        count = round(levelRoll(GameOptions[optionsIndex][2][4], level)),
        // shared per-group, not per-ship - so ships that use it (see
        // createShip's arcPoint) draw their orbit reference point from the
        // same neighborhood the whole group spawns into
        spawnRegion = drawCard(_spawnRegionDeck),
        ships = doTimes(
          count,
          () => createShip(optionsIndex, level, spawnRegion),
        );

      scatterObjects(
        spawnRegion,
        true,
        ...doTimes(ships, (ship) => ship[0]),
      );

      return ships;
    },
  );
