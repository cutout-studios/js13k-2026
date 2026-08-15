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
import content from "./content.json" with { type: "json" };

const { random, E, atan, round, abs, cos, PI, log } = Math;

const bell = () => (random() + random() + random()) / 3;
const range = (min: number, max: number) => min + ((max - min) * bell());
const exp = (x: number, c = 1) => E ** (x * c);
const clamp = (min: number, max: number, value: number) =>
  Math.min(max, Math.max(min, value));

const randomUnshift = <T>(value: T, array: T[], part: number = 0.33): T[] => {
  const randomIndex = round(random() * array.length * part);

  return [...array.slice(0, randomIndex), value, ...array.slice(randomIndex)];
};

export const difficultyCurve = (level: number, falloff: number = 0.25) =>
  2 * atan(level * falloff) / PI;
export const difficultyRange = (
  level: number,
  curveFactor: number,
  rangeFactor: number = 1.5,
  minValue: number = -Infinity,
  maxValue: number = Infinity,
) => {
  const floor = exp(difficultyCurve(level), curveFactor);
  return clamp(
    minValue,
    maxValue,
    round(range(floor, floor * rangeFactor)),
  );
};

export const numberDeck = (length: number): number[] => {
  let result: number[] = [];

  doTimes(length, (number) => result = randomUnshift(number, result, 1));

  return result;
};

// --

export const waves = (level: number) =>
  difficultyRange(
    level,
    2.5, // rate
    1.5, // range
    2, // min
    14, // max
  );

// --

let _enemyDeck = numberDeck(content.length), _gearDeck = numberDeck(4);

export const enemySets = (wave: number, level: number) =>
  doTimes(
    round(
      clamp(
        1, // min
        6, // max
        abs(cos(wave)) * difficultyCurve(level) * 7.5, // rate
      ),
    ),
    () => {
      const set = _enemyDeck.pop() as number;
      _enemyDeck = randomUnshift(set, _enemyDeck);
      return enemyStats(set, level);
    },
  );

const ENEMY_MAX_DIFFICULTY = [35, 100, 250, 800].map(log);
const ENEMY_STAT_RANGES = [1.5, 1.2, 1.5, 1];
const ENEMY_MINIMUMS = [8, 10, 5, 10];
const ENEMY_MAXIMUMS = [Infinity, 100, Infinity, 80];
export const enemyStats = (typeIndex: number, level: number) => {
  const { enemy, weapon } = content[typeIndex];
  const [count, health, speed, drop] = enemy;
  const [, damage] = weapon;

  return [health, speed, damage, drop].reduce(
    (
      result,
      value,
      index,
    ) => [
      ...result,
      difficultyRange(
        level,
        ENEMY_MAX_DIFFICULTY[value - 1],
        ENEMY_STAT_RANGES[index],
        ENEMY_MINIMUMS[index],
        ENEMY_MAXIMUMS[index],
      ),
    ],
    [typeIndex, count],
  );
};

// --
const TYPE_BY_MASS_MINIMUMS = [
  [3, 10, 20],
  [3, 10, 20],
  [8, 32, 80],
  [2, 7, 12],
];
const RANK_BY_AFFIX_MINIMUMS = [
  [2, 10, 25, 50],
  [5, 15, 35, 85],
  [8, 20, 45, 100],
];
const RANK_BY_DAMAGE_MINIMUMS = [
  [8, 16, 32, 50],
  [12, 20, 56, 80],
  [16, 35, 90, 150],
];
const RANK_BY_SPEED_MINIMUMS = [
  [0.8, 2, 5, 12],
  [1.2, 3, 7, 15],
  [1.5, 4, 9, 18],
];
const RANK_BY_RANGE_MINIMUMS = [
  [15, 40, 60, 90],
  [25, 50, 70, 100],
  [35, 60, 80, 100],
];
let droplessRun = 0;
export const gearDrop = (colorType: number, rank: number) => {
  if (random() < difficultyCurve(droplessRun)) {
    droplessRun++;
    return;
  } else {
    droplessRun = 0;
  }

  const gearType = _gearDeck.pop() as number;

  _gearDeck = randomUnshift(gearType, _gearDeck);

  const color = content[colorType];
  const minimumMass = TYPE_BY_MASS_MINIMUMS[gearType][color.density - 1];
  const result: any[] = [
    colorType,
    gearType,
    rank,
    round(range(minimumMass, minimumMass * 2)),
  ];

  let affixOptions: any[] = [];

  for (const option of color.affix.global) {
    affixOptions = randomUnshift(option, affixOptions, 1);
  }

  if (gearType === 2 && color.affix.body) {
    affixOptions = randomUnshift(color.affix.body[0], affixOptions, 1);
  } else if (gearType === 3 && color.affix.engine) {
    affixOptions = randomUnshift(color.affix.engine[0], affixOptions, 1);
  }

  result.push(
    doTimes(
      (gearType <= 1 ? rank - 1 : rank) + (color.weapon[4] ? 1 : 0),
      () => {
        const [type, magnitude, isRankCount] = affixOptions.pop();
        const affixMinimum = RANK_BY_AFFIX_MINIMUMS[rank - 1][magnitude - 1];

        if (isRankCount) {
          return [
            type,
            rank,
          ];
        }

        return [
          type,
          Number((range(affixMinimum, affixMinimum * 2)).toFixed(1)),
        ];
      },
    ),
  );

  if (gearType <= 1) {
    const [count, damage, _range, speed] = color.weapon;

    const damageMinimum = RANK_BY_DAMAGE_MINIMUMS[rank - 1][damage - 1];
    const speedMinimum = RANK_BY_SPEED_MINIMUMS[rank - 1][speed - 1];
    const rangeMinimum = RANK_BY_RANGE_MINIMUMS[rank - 1][_range - 1];

    result.push(
      round(range(damageMinimum, damageMinimum * 1.5)),
      round(range(speedMinimum, speedMinimum * 1.5)),
      count,
      round(Math.min(100, range(rangeMinimum, rangeMinimum * 1.5))),
    );
  }

  return result;
};

// --
const stageIndicies = [1, 2, 5, 10, 25, 50];

for (const stage of stageIndicies) {
  console.log(`stage: ${stage}, waves: ${waves(stage)}`);
  console.log("first wave:");

  const firstWave = enemySets(1, stage);

  console.table(
    firstWave.map((
      [type, count, health, speed, damage, drop],
    ) => ({
      type: content[type].type,
      count,
      health,
      speed: type === 0 ? 0 : speed,
      damage,
      ["drop%"]: Number(((drop as number) / (count as number)).toFixed(1)),
    })),
    ["type", "count", "health", "speed", "damage", "drop%"],
  );

  const drops: any[] = [];
  for (const [type, count, _, __, ___, drop] of firstWave) {
    doTimes(count as number, () => {
      if (random() > ((drop as number) / (count as number)) / 100) return;

      const possibleDrop = gearDrop(
        type,
        difficultyRange(stage, log(3), 1.1, 1, 3),
      );

      if (possibleDrop) drops.push(possibleDrop);
    });
  }

  if (drops.length) {
    console.log("drops:");
    console.table(
      drops.map((
        [color, type, rank, mass, affixes, damage, speed, count, range],
      ) => ({
        color: content[color].type,
        type: ["left wing", "right wing", "body", "engine"][type],
        rank,
        mass,
        affixes,
        damage,
        speed,
        count,
        range,
      })),
      [
        "color",
        "type",
        "rank",
        "mass",
        "affixes",
        "damage",
        "speed",
        "count",
        "range",
      ],
    );
  }
}
