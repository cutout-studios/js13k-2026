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

import { doTimes } from "~common";

import { atan, floor, length, max, min, PI, random, round } from "~alias";
import { Affix, Band, Item } from "./types.ts";
import content, {
  DIFFICULTY_FALLOFF,
  ENEMY_STAT_BANDS,
  ENEMY_STAT_KEYS,
  ITEM_RANK_THRESHOLDS,
  ITEM_STAT_BANDS,
  ITEM_TYPES,
  ITEM_WEAPON_KEYS,
  WAVE_BAND,
  WAVE_CURVE,
  WAVE_PACING,
  WAVE_SIZE_BAND,
} from "./constants.ts";

// --

const bell = () => (random() + random() + random()) / 3;
const range = (lo: number, hi: number) => lo + (hi - lo) * bell();

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
export const difficultyCurve = (level: number, falloff = DIFFICULTY_FALLOFF) =>
  (2 * atan(level * falloff)) / PI;

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
  round(_statRoll(WAVE_BAND, difficultyCurve(level)));

const _enemyDeck = shuffled(length(content));
const _drawEnemy = (typeIndex: number, level: number) => {
  const {
    enemy: [count, health, speed, drop],
    weapon: [, damage],
    density: mass,
  } = content[typeIndex];

  const proxy = { health, speed, mass, damage, drop };

  return [
    typeIndex,
    count,
    ...ENEMY_STAT_KEYS.map((key: keyof typeof ENEMY_STAT_BANDS) =>
      _statRoll(
        ENEMY_STAT_BANDS[key][proxy[key] - 1],
        difficultyCurve(level),
      )
    ),
  ];
};

export const drawEnemies = (wave: number, level: number) =>
  doTimes(
    round(
      min(
        WAVE_SIZE_BAND[1],
        max(
          WAVE_SIZE_BAND[0],
          WAVE_PACING[wave % length(WAVE_PACING)] *
            difficultyCurve(level) * WAVE_CURVE,
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

const _itemDeck = shuffled(length(ITEM_TYPES));
export const drawItem = (
  colorType: number,
  level: number,
  quality = 0,
): Item => {
  const {
    affix,
    density: mass,
    weapon: [count, damage, life, rate, bonusAffix, cost, bulletPattern],
  } = content[colorType];

  const rank = _itemRankRoll(level, quality), type = draw(_itemDeck);

  const pool: Affix[] = [];
  for (
    const option of [
      ...affix.global,
      ...(affix[ITEM_TYPES[type] as keyof typeof affix] ?? []),
    ]
  ) insert(pool, option as Affix);

  const affixCount = (type <= 1 ? rank - 1 : rank) + (bonusAffix ? 1 : 0);

  const proxy = { damage, life, rate, cost, mass, affix: 0 };
  const roll = (key: keyof typeof ITEM_STAT_BANDS, magnitude = proxy[key]) =>
    _statRoll(
      ITEM_STAT_BANDS[key][magnitude - 1],
      (rank - 1) / 2,
    );

  const result: Item = [
    colorType,
    type,
    rank,
    roll("mass"),
    doTimes(min(affixCount, length(pool)), () => {
      const [name, magnitude, type = 0] = pool.pop()!;
      return type === 2 ? [name, magnitude * rank, type] : [
        name,
        roll("affix", magnitude),
        type,
      ];
    }) as Affix[],
  ];

  if (type <= 1) { // e.g. is weapon
    result.push(
      count,
      ...ITEM_WEAPON_KEYS.map((value) => roll(value)),
      bulletPattern,
    );
  }

  return result;
};
