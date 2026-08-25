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

import { createObject, XOObject, XYZ } from "~/3D";
import { createActionSequence } from "~/clock";
import { length, max, min, random, round } from "~/alias";
import { doTimes } from "~/common";
import { range } from "~/random";

import { EnemyGroup, World } from "./types.ts";
import {
  COLORS,
  ENEMY_COLOR_SHAPES,
  ENEMY_DATA_BANDS,
  ENEMY_DATA_NAMES,
  ENEMY_PLANE_DISTANCE,
  ENEMY_SPREAD_AMOUNT,
  ENEMY_WAVE_CURVE,
  ENEMY_WAVE_PACING,
  ENEMY_WAVE_SIZE_BAND,
} from "./constants.ts";

import { levelCurve, roll } from "./waves.ts";
import { createDeck, drawCard } from "../decks.ts";
import { drawItem } from "../ship/items.ts";

export const drawEnemyGroups = (wave: number, level: number) =>
  doTimes(
    round(
      min(
        ENEMY_WAVE_SIZE_BAND[1],
        max(
          ENEMY_WAVE_SIZE_BAND[0],
          ENEMY_WAVE_PACING[wave % length(ENEMY_WAVE_PACING)] *
            levelCurve(level) * ENEMY_WAVE_CURVE,
        ),
      ),
    ),
    () => _drawEnemyGroup(drawCard(_enemyDeck), level),
  );

const _sequenceStub = createActionSequence([]);
const _enemyDeck = createDeck(length(COLORS));
const _drawEnemyGroup = (
  typeIndex: number,
  level: number,
): EnemyGroup => {
  const [, , mass, [count, health, speed, drop], [, damage]] =
      COLORS[typeIndex],
    [, geometry, material] = ENEMY_COLOR_SHAPES[typeIndex],
    data: EnemyGroup[2] = [],
    items: (ItemData | undefined)[] = [];

  const proxy = { health, speed, mass, damage, drop },
    spawnQuadrantSize = min(
      3.5,
      (geometry![0] * count * ENEMY_SPREAD_AMOUNT) / 2,
    );

  const objects = doTimes(count, () => {
    const [rolledHealth, rolledSpeed, rolledMass, rolledDamage, rolledDrop] =
      ENEMY_DATA_NAMES.map((key: keyof typeof ENEMY_DATA_BANDS) =>
        roll(ENEMY_DATA_BANDS[key][proxy[key] - 1], level)
      );

    data.push([rolledHealth, rolledDamage, rolledMass, rolledSpeed]);
    items.push(
      random() * 100 < rolledDrop ? drawItem(typeIndex, level) : undefined,
    );

    return createObject(
      [[ // TODO: come in from off the screen, based on the total number of groups
        ...doTimes(2, () => range(-spawnQuadrantSize, spawnQuadrantSize)),
        -ENEMY_PLANE_DISTANCE,
      ] as XYZ],
      geometry,
      material,
    );
  });

  return [objects, [[], []], data, _sequenceStub, items];
};

export const getEnemyObjects = ([enemyGroups]: World): XOObject[][] =>
  enemyGroups.map(([objects]) => objects);

export const deleteEnemies = (
  enemyGroup: World,
  enemyIndicies: number[],
) => {
  for (const index of enemyIndicies.sort((a, b) => b - a)) {
    enemyGroup[0].splice(index, 1);
    enemyGroup[2].splice(index, 1);
    enemyGroup[4].splice(index, 1);
  }
};
