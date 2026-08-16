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
  health: [[1, 25], [7, 60], [20, 120], [80, 200]],
  speed: [[10, 25], [30, 75], [60, 100]],
  mass: [[4, 20], [12, 25], [40, 100]],
  damage: [[1, 8], [8, 25], [50, 100]],
  drop: [[2, 10], [10, 20], [15, 25], [20, 30]],
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

export const PLAYER_STAT_TYPES = [
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
  "lowestPool",
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

// TODO: fill in remaining base stats
export const PLAYER_BASE_STATS = {
  [0]: 2, // armor
  [3]: 0.05, // bulletCritChance
  [4]: 1, // bulletCritDamage
  [11]: 30, // fuel
  [12]: 0.1, // fuelCost
  [14]: 10, // fuelRegen
  [17]: 1.2, // levelQuality
  [21]: 20, // shield
  [22]: 10, // sheildRegen
};

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
        [16, 2], // itemQuality
        [17, 2], // levelQuality
        [3, 1], // bulletCritChance
        [4, 3], // bulletCritDamage
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
        [12, 1, 1], // fuelCost — name, magnitude, type (+percent, -percent, +count)
        [26, 2], // strafeSpeed
        [6, 4], // bulletLife
      ],
      body: [
        [10, 1], // damageTakenFromFuel
      ],
      engine: [
        [25, 1], // spinTime
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
        [21, 2], // shield
        [9, 1, 1], // damageTaken
        [19, 2], // mass
      ],
      body: [[0, 1, 2]], // armor
      engine: [[13, 1, 2]], // fuelEjectDelay
    },
  },
  {
    type: COLOR_TYPES[3],
    enemy: [9, 1, 2, 1],
    weapon: [9, 1, 1, 1, 0, 1, 2],
    density: 1,
    affix: {
      global: [
        [15, 2], // itemMixQuality
        [2, 1, 2], // bulletCount
        [1, 1], // armorSave
      ],
      body: [[22, 2]], // shieldRegen
      engine: [[14, 2]], // fuelRegen
    },
  },
  {
    type: COLOR_TYPES[4],
    enemy: [3, 2, 2, 2],
    weapon: [2, 2, 2, 2, 0, 1, 1],
    density: 2,
    affix: {
      global: [
        [5, 2], // bulletDamage
        [7, 2], // bulletRate
        [11, 2], // fuel
      ],
      body: [[27, 2]], // trackSpeed
      engine: [[24, 2]], // spinHandling
    },
  },
  {
    type: COLOR_TYPES[5],
    enemy: [2, 3, 3, 2],
    weapon: [1, 2, 0, 1, 0, 2, 0],
    density: 2,
    affix: {
      global: [
        [18, 2], // lowestPool
        [20, 1], // resolve
        [8, 2], // bulletSpread
      ],
      body: [[25, 2]], // spinTime
      engine: [[23, 2]], // spinDamage
    },
  },
];
