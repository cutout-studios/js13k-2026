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

import { Band } from "./types.ts";

export const DIFFICULTY_FALLOFF = 0.135;

export const BASE_SHIELD = 20;
export const BASE_ARMOR = 20;
export const BASE_FUEL = 30;

export const BASE_SHIELD_REGEN = 10;
export const BASE_FUEL_REGEN = 10;

export const BASE_CRIT_CHANCE = 0.05;
export const BASE_CRIT_AMOUNT = 1.00;

export const BASE_SPIN_COST_OF_MASS = 0.10;

export const BASE_LEVEL_UP_AMOUNT = 1.2;

export const WAVE_CURVE = 7.5;
export const WAVE_PACING = [0.55, 0.8, 1, 0.7, 0.9, 1];
export const WAVE_BAND = [2, 14] as Band;
export const WAVE_SIZE_BAND = [1, 6] as Band;

export const COLOR_TYPES = [
  "purple",
  "green",
  "blue",
  "pink",
  "red",
  "yellow",
] as const;

export const ENEMY_STAT_KEYS = [
  "health",
  "speed",
  "mass",
  "damage",
  "drop",
] as const;

export const ENEMY_STAT_BANDS = {
  health: [[2, 30], [2, 120], [2, 500], [2, 1600]],
  speed: [[15, 35], [15, 55], [15, 75]],
  mass: [[8, 20], [8, 60], [8, 200]],
  damage: [[2, 12], [2, 30], [2, 80]],
  drop: [[5, 12], [5, 18], [5, 25], [5, 40]],
} as const;

export const ITEM_TYPES = ["leftWing", "rightWing", "body", "engine"];
export const ITEM_BULLET_TYPES = ["none", "fan", "nova"] as const;
export const ITEM_RANK_THRESHOLDS = [0.75, 1.25] as const;

export const ITEM_WEAPON_KEYS = ["damage", "life", "rate", "cost"] as const;
export const ITEM_STAT_BANDS = {
  mass: [[1, 15], [1, 15], [3, 40], [2, 15]],
  affix: [[2, 8], [10, 20], [25, 45], [50, 100]],
  damage: [[8, 16], [16, 35], [32, 90], [50, 150]],
  rate: [[0.8, 1.5], [2, 4], [5, 9], [12, 18]],
  life: [[15, 32], [36, 55], [55, 72], [72, 83]],
  cost: [[0, 0], [3, 1], [15, 10]],
} as const;

export const ITEM_RANK_UP_MIX_COUNT = 3;

// NOTE: Every affix is simple math, except...

// damageTakenFromFuel — couples two systems
// fuelEjectDelay — a timer, not a stat
// lowestStat — has to read the finished record, so it runs after the fold
// armorSave — a roll against a stat rather than a stat

export const ITEM_AFFIX_TYPES = [
  "armor",
  "armorSave",
  "bulletCount",
  "bulletCritChance",
  "bulletCritDamage",
  "bulletDamage",
  "bulletLife",
  "bulletRate",
  "bulletSpread",
  "damageTaken",
  "damageTakenFromFuel",
  "fuel",
  "fuelCost",
  "fuelEjectDelay",
  "fuelRegen",
  "itemMixQuality",
  "itemQuality",
  "levelQuality",
  "lowestStat",
  "mass",
  "resolve",
  "shield",
  "shieldRegen",
  "spinDamage",
  "spinHandling",
  "spinTime",
  "strafeSpeed",
  "trackSpeed",
];

export default [
  {
    type: COLOR_TYPES[0],
    // count, health, speed, drop
    enemy: [3, 2, 0, 3],
    // count, damage, life, rate, affix, cost, bulletPattern
    weapon: [1, 3, 3, 0, 0, 2, 0],
    density: 1,
    affix: {
      global: [
        [ITEM_AFFIX_TYPES[16], 2], // itemQuality
        [ITEM_AFFIX_TYPES[17], 2], // levelQuality
        [ITEM_AFFIX_TYPES[3], 1], // bulletCritChance
        [ITEM_AFFIX_TYPES[4], 3], // bulletCritDamage
      ],
    },
  },
  {
    type: COLOR_TYPES[1],
    enemy: [4, 2, 3, 2],
    weapon: [1, 1, 3, 3, 0, 0, 0],
    density: 1,
    affix: {
      global: [
        [ITEM_AFFIX_TYPES[12], 1, 1], // fuelCost — name, magnitude, type (+percent, -percent, +count)
        [ITEM_AFFIX_TYPES[26], 2], // strafeSpeed
        [ITEM_AFFIX_TYPES[6], 4], // bulletLife
      ],
      body: [
        [ITEM_AFFIX_TYPES[10], 1], // damageTakenFromFuel
      ],
      engine: [
        [ITEM_AFFIX_TYPES[25], 1], // spinTime
      ],
    },
  },
  {
    type: COLOR_TYPES[2],
    enemy: [1, 4, 1, 4],
    weapon: [1, 1, 2, 1, 1, 0, 0],
    density: 3,
    affix: {
      global: [
        [ITEM_AFFIX_TYPES[21], 2], // shield
        [ITEM_AFFIX_TYPES[9], 1, 1], // damageTaken
        [ITEM_AFFIX_TYPES[19], 2], // mass
      ],
      body: [[ITEM_AFFIX_TYPES[0], 1, 2]], // armor
      engine: [[ITEM_AFFIX_TYPES[13], 1, 2]], // fuelEjectDelay
    },
  },
  {
    type: COLOR_TYPES[3],
    enemy: [9, 1, 2, 1],
    weapon: [9, 1, 1, 1, 0, 1, 2],
    density: 1,
    affix: {
      global: [
        [ITEM_AFFIX_TYPES[15], 2], // itemMixQuality
        [ITEM_AFFIX_TYPES[2], 1, 2], // bulletCount
        [ITEM_AFFIX_TYPES[1], 1], // armorSave
      ],
      body: [[ITEM_AFFIX_TYPES[22], 2]], // shieldRegen
      engine: [[ITEM_AFFIX_TYPES[14], 2]], // fuelRegen
    },
  },
  {
    type: COLOR_TYPES[4],
    enemy: [3, 2, 2, 2],
    weapon: [2, 2, 2, 2, 0, 1, 1],
    density: 2,
    affix: {
      global: [
        [ITEM_AFFIX_TYPES[5], 2], // bulletDamage
        [ITEM_AFFIX_TYPES[7], 2], // bulletRate
        [ITEM_AFFIX_TYPES[11], 2], // fuel
      ],
      body: [[ITEM_AFFIX_TYPES[27], 2]], // trackSpeed
      engine: [[ITEM_AFFIX_TYPES[24], 2]], // spinHandling
    },
  },
  {
    type: COLOR_TYPES[5],
    enemy: [2, 3, 3, 2],
    weapon: [1, 2, 0, 1, 0, 2, 0],
    density: 2,
    affix: {
      global: [
        [ITEM_AFFIX_TYPES[18], 2], // lowestStat
        [ITEM_AFFIX_TYPES[20], 1], // resolve
        [ITEM_AFFIX_TYPES[8], 2], // bulletSpread
      ],
      body: [[ITEM_AFFIX_TYPES[25], 2]], // spinTime
      engine: [[ITEM_AFFIX_TYPES[23], 2]], // spinDamage
    },
  },
];
