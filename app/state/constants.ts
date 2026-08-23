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

import { createPrism, createPyramid, createSphere, Z_AXIS, X_AXIS } from "~/3D";
import { Band } from "~/random";

import { Color, PlayerStatistic } from "./types.ts";

export const GAME_DIFFICULTY_FALLOFF = 0.135;

export const PLAYER_STATISTICS: PlayerStatistic[] = [
  ["Armor", 2, 1, 2],

  ["Armor Save", 0, 1, 0],
  ["Bullet Count", 2, 1, 1],
  ["Bullet Crit Chance", 0, 1, 0.05],
  ["Bullet Crit Damage", 0, 3, 1],
  ["Bullet Damage", 0, 2, 1],

  ["Bullet Lifetime", 0, 3, 1],
  ["Bullet Rate", 0, 2, 1],
  ["Bullet Spread", 0, 2, 1],
  ["Damage Taken", 1, 1, 1],
  ["Damage Taken From Fuel", 0, 1, 0],

  ["Fuel", 0, 2, 30],
  ["Fuel Cost", 1, 2, 0.1],
  ["Fuel Eject Delay", 2, 1, 0],
  ["Fuel Regen", 0, 2, 10],
  ["Item Mixture Quality", 0, 2, 1],

  ["Item Quality", 0, 2, 1],
  ["Level Quality", 0, 2, 1.2],
  ["Lowest Resource", 0, 2, 0],
  ["Mass", 0, 2, 1],
  ["Resolve", 0, 1, 0],

  ["Shield", 0, 2, 20],
  ["Shield Regen", 0, 2, 10],
  ["Spin Damage", 0, 2, 1],
  ["Spin Handling", 0, 2, 0.1],
  ["Spin Time", 0, 2, 1.5],

  ["Strafe Speed", 0, 2, 4],
  ["Track Speed", 0, 2, 0.8],
];

export const PLAYER_SHIP_DISTANCE = 5;
export const PLAYER_SHIP_SHAPE = createPyramid([0.25, 0.1, 0.25], 6);

export const COLOR_PURPLE: Color = [
  "Purple",
  0x8434D4,
  1,
  [3, 2, 0, 3, [[createPyramid([0.25, 0.25, 0.125])]]],
  [1, 3, 3, 0, 0, 2, 0],
  // itemQuality, levelQuality, bulletCritChance, bulletCritDamage
  [[16, 17, 3, 4]],
];

const GREEN_PRONG = createPyramid([0.065, 0.065, 0.095], 12);
export const COLOR_GREEN: Color = [
  "Green",
  0xA0DD27,
  1,
  [4, 2, 3, 2, [
    [createSphere(0.20, 24)],
    [GREEN_PRONG, [0.2, -0.08, 0.15], [[0, 1, -1], 1.25]],
    [GREEN_PRONG, [-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]],
  ]],
  [1, 1, 3, 3, 0, 0, 0],
  [
    [12, 26, 6], // fuelCost, strafeSpeed, bulletLifetime
    undefined,
    undefined,
    [10], // damageTakenFromFuel
    [25], // spinTime
  ],
];

export const COLOR_BLUE: Color = [
  "Blue",
  0x29A9D4,
  3,
  [1, 4, 1, 4, [
    [createSphere(0.52, 32)],
    [createPrism([0.09, 0.09, 0.03], 16), [0, -0.30, 0.42], [X_AXIS, 0.57]],
  ]],
  [1, 1, 2, 1, 1, 0, 0],
  [
    [21, 9, 19], // shield, damageTaken, mass
    undefined,
    undefined,
    [0], // armor
    [13], // fuelEjectDelay
  ],
];

export const COLOR_PINK: Color = [
  "Pink",
  0xD4349F,
  1,
  [9, 1, 2, 1, [[createSphere(0.10, 20)]]],
  [9, 1, 1, 1, 0, 1, 2],
  [
    [15, 2, 1], // itemMixtureQuality, bulletCount, armorSave
    undefined,
    undefined,
    [22], // shieldRegen
    [14], // fuelRegen
  ],
];

export const COLOR_RED: Color = [
  "Red",
  0xEE3030,
  2,
  [3, 2, 2, 2, [[createPyramid([0.11, 0.09, 0.4], 3), undefined, [
    Z_AXIS,
    -1.61,
  ]]]],
  [2, 2, 2, 2, 0, 1, 1],
  [
    [5, 7, 11], // bulletDamage, bulletRate, fuel
    undefined,
    undefined,
    [27], // trackSpeed
    [24], // spinHandling
  ],
];

const YELLOW_ARM = createPrism([0.2, 0.012, 0.15]);
export const COLOR_YELLOW: Color = [
  "Yellow",
  0xF4AD32,
  2,
  [2, 3, 3, 2, [
    [YELLOW_ARM, [0.19, -0.04, 0], [Z_AXIS, -0.3]],
    [YELLOW_ARM, [-0.19, -0.04, 0], [Z_AXIS, 0.3]],
    [YELLOW_ARM, [0.52, 0.02, 0], [Z_AXIS, 0.65]],
    [YELLOW_ARM, [-0.52, 0.02, 0], [Z_AXIS, -0.65]],
  ]],
  [1, 2, 0, 1, 0, 2, 2],
  [
    [18, 20, 8], // lowestResource, resolve, bulletSpread
    undefined,
    undefined,
    [25], // spinTime
    [23], // spinDamage
  ],
];

export const COLORS = [
  COLOR_PURPLE,
  COLOR_GREEN,
  COLOR_BLUE,
  COLOR_PINK,
  COLOR_RED,
  COLOR_YELLOW,
];

export const ENEMY_WAVE_CURVE = 7.5;
export const ENEMY_WAVE_PACING = [0.55, 0.8, 1, 0.7, 0.9, 1];
export const ENEMY_WAVE_COUNT_BAND = [2, 14] as Band;
export const ENEMY_WAVE_SIZE_BAND = [1, 6] as Band;

export const ENEMY_DATA_NAMES = [
  "health",
  "speed",
  "mass",
  "damage",
  "drop",
] as const;

export const ENEMY_DATA_BANDS = {
  health: [[1, 25], [7, 60], [20, 120], [80, 200]],
  speed: [[10, 25], [30, 75], [60, 100]],
  mass: [[4, 20], [12, 25], [40, 100]],
  damage: [[1, 8], [8, 25], [50, 100]],
  drop: [[2, 8], [10, 20], [18, 25], [20, 40]],
} as const;

export const ITEM_NAMES = ["Wing (L)", "Wing (R)", "Body", "Engine"];
export const ITEM_WEAPON_NAMES = ["Standard", "Wide", "Sphere"] as const;
export const ITEM_WEAPON_DATA_NAMES = [
  "damage",
  "life",
  "rate",
  "cost",
] as const;
export const ITEM_DATA_BANDS = {
  affix: [[2, 12], [15, 35], [45, 100]],
  cost: [[0, 0], [20, 10], [150, 100]],
  damage: [[8, 16], [16, 35], [32, 90], [50, 150]],
  life: [[15, 32], [36, 55], [55, 72], [72, 83]],
  mass: [[1, 15], [1, 15], [3, 40], [2, 15]],
  rate: [[0.7, 1.5], [1.5, 3], [5, 9], [12, 18]],
} as const;

export const ITEM_RANK_THRESHOLDS = [0.85, 1.35] as const;
export const ITEM_RANK_UP_MIX_COUNT = 3;
