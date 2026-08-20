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

import { doTimes } from "~/common";
import { Band, bell, range } from "~/random";

import { Item, ItemAffix } from "../types.ts";
import { atan, floor, length, max, min, PI, random, round } from "~/alias";
import {
  COLORS,
  ENEMY_DATA_BANDS,
  ENEMY_DATA_NAMES,
  ENEMY_WAVE_COUNT_BAND,
  ENEMY_WAVE_CURVE,
  ENEMY_WAVE_PACING,
  ENEMY_WAVE_SIZE_BAND,
  GAME_DIFFICULTY_FALLOFF,
  ITEM_DATA_BANDS,
  ITEM_NAMES,
  ITEM_RANK_THRESHOLDS,
  ITEM_WEAPON_DATA_NAMES,
  PLAYER_STATISTICS,
} from "../constants.ts";

// deck primitives
const insert = <T>(deck: T[], value: T, delay = 0) =>
  deck.splice(floor(random() * (length(deck) * (1 - delay) + 1)), 0, value);

const shuffled = (size: number) => {
  const deck: number[] = [];
  doTimes(size, (i) => insert(deck, i));
  return deck;
};

const draw = (deck: number[], delay = 0.67) => {
  const value = deck.pop()!;
  insert(deck, value, delay);
  return value;
};

// difficulty
export const difficultyCurve = (
  level: number,
  falloff = GAME_DIFFICULTY_FALLOFF,
) => (2 * atan(level * falloff)) / PI;

const _statRoll = (
  [start, end]: Band = [0, 0],
  curve: number,
  spread = 1.125,
) => {
  const base = start + (end - start) * curve;
  return range(base, base * spread);
};

// enemies
export const getWaveCount = (level: number) =>
  round(_statRoll(ENEMY_WAVE_COUNT_BAND, difficultyCurve(level)));

const _enemyDeck = shuffled(length(COLORS));
const _drawEnemy = (typeIndex: number, level: number) => {
  const [, , mass, [count, health, speed, drop], [, damage]] =
    COLORS[typeIndex];
  const proxy = { health, speed, mass, damage, drop };

  return [
    typeIndex,
    count,
    ...ENEMY_DATA_NAMES.map((key: keyof typeof ENEMY_DATA_BANDS) =>
      _statRoll(
        ENEMY_DATA_BANDS[key][proxy[key] - 1],
        difficultyCurve(level),
      )
    ),
  ];
};

export const drawEnemies = (wave: number, level: number) =>
  doTimes(
    round(
      min(
        ENEMY_WAVE_SIZE_BAND[1],
        max(
          ENEMY_WAVE_SIZE_BAND[0],
          ENEMY_WAVE_PACING[wave % length(ENEMY_WAVE_PACING)] *
            difficultyCurve(level) * ENEMY_WAVE_CURVE,
        ),
      ),
    ),
    () => _drawEnemy(draw(_enemyDeck), level),
  );

// items
const _itemRankRoll = (level: number, quality = 0) => {
  const roll = bell() + difficultyCurve(level) + quality;
  return roll >= ITEM_RANK_THRESHOLDS[1]
    ? 3
    : roll >= ITEM_RANK_THRESHOLDS[0]
    ? 2
    : 1;
};

const _itemDeck = shuffled(length(ITEM_NAMES));
export const drawItem = (
  colorType: number,
  level: number,
  quality = 0,
): Item => {
  const [
    ,
    ,
    mass,
    ,
    [count, damage, life, rate, bonusAffix, cost, bulletPattern],
    affixes,
  ] = COLORS[colorType];
  const rank = _itemRankRoll(level, quality), type = draw(_itemDeck);
  const pool: number[] = [];
  for (const option of [...affixes[0]!, ...(affixes[type + 1] ?? [])]) {
    insert(pool, option);
  }

  const affixCount = (type <= 1 ? rank - 1 : rank) + (bonusAffix ? 1 : 0);

  const proxy = { damage, life, rate, cost, mass, affix: 0 };
  const roll = (key: keyof typeof ITEM_DATA_BANDS, magnitude = proxy[key]) =>
    _statRoll(
      ITEM_DATA_BANDS[key][magnitude - 1],
      (rank - 1) / 2,
    );

  const result: Item = [
    colorType,
    type,
    rank,
    roll("mass"),
    doTimes(min(affixCount, length(pool)), (): ItemAffix => {
      const name = pool.pop()!,
        [, affixType, magnitude] = PLAYER_STATISTICS[name];
      return [
        name,
        affixType === 2 ? magnitude * rank : roll("affix", magnitude),
      ];
    }) as ItemAffix[],
  ];

  if (type <= 1) { // e.g. is weapon
    result.push(
      count,
      ...ITEM_WEAPON_DATA_NAMES.map((value) => roll(value)),
      bulletPattern,
    );
  }

  return result;
};
