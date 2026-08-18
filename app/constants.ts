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

export const MAX_DISTANCE = -300;
export const DIFFICULTY_FALLOFF = 0.135;

export const WAVE_CURVE = 7.5;
export const WAVE_PACING = [0.55, 0.8, 1, 0.7, 0.9, 1];
export const WAVE_BAND = [2, 14] as Band;
export const WAVE_SIZE_BAND = [1, 6] as Band;

export const COLOR_TYPES = [
  "Purple",
  "Green",
  "Blue",
  "Pink",
  "Red",
  "Yellow",
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
  drop: [[2, 8], [10, 20], [18, 25], [20, 40]],
} as const;

export const ITEM_TYPES = ["Wing (Left)", "Wing (Right)", "Body", "Engine"];
export const ITEM_BULLET_TYPES = ["Standard", "Wide", "Sphere"] as const;
export const ITEM_RANK_THRESHOLDS = [0.85, 1.35] as const;

export const ITEM_WEAPON_KEYS = ["damage", "life", "rate", "cost"] as const;
export const ITEM_STAT_BANDS = {
  affix: [[2, 12], [15, 35], [45, 100]],
  cost: [[0, 0], [20, 10], [150, 100]],
  damage: [[8, 16], [16, 35], [32, 90], [50, 150]],
  life: [[15, 32], [36, 55], [55, 72], [72, 83]],
  mass: [[1, 15], [1, 15], [3, 40], [2, 15]],
  rate: [[0.7, 1.5], [1.5, 3], [5, 9], [12, 18]],
} as const;

export const ITEM_RANK_UP_MIX_COUNT = 3;

export const PLAYER_STAT_TYPES = [
  "Armor",
  "Armor Save",
  "Bullet Count",
  "Bullet Crit Chance",
  "Bullet Crit Damage",
  "Bullet Damage",
  "Bullet Lifetime",
  "Bullet Rate",
  "Bullet Spread",
  "Damage Taken",
  "Damage Taken From Fuel",
  "Fuel",
  "Fuel Cost",
  "Fuel Eject Delay",
  "Fuel Regen",
  "Item Mixture Quality",
  "Item Quality",
  "Level Quality",
  "Lowest Resource",
  "Mass",
  "Resolve",
  "Shield",
  "Shield Regen",
  "Spin Damage",
  "Spin Handling",
  "Spin Time",
  "Strafe Speed",
  "Track Speed",
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
        [12, 2, 1], // fuelCost — name, magnitude, type (+percent, -percent, +count)
        [26, 2], // strafeSpeed
        [6, 3], // bulletLife
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
    weapon: [1, 2, 0, 1, 0, 2, 2],
    density: 2,
    affix: {
      global: [
        [18, 2], // lowestResource
        [20, 1], // resolve
        [8, 2], // bulletSpread
      ],
      body: [[25, 2]], // spinTime
      engine: [[23, 2]], // spinDamage
    },
  },
];
