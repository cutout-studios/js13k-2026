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

import { ShipSnapshot, WeaponSnapshot } from "../ship/types.ts";

export const PLAYER_SHIP_Z_PLANE = 5;
export const PLAYER_AIM_Z_PLANE = 8;
export const PLAYER_X_BOUND = 2.8;
export const PLAYER_Y_BOUND = 2.1;

export const BULLET_ALPHA = 0xBF;
export const BULLET_MAX_RANGE = 20;

export const ENEMY_BULLET_RAMP_TIME = 0.3;
export const ENEMY_FIRE_RANGE_MARGIN = 2;

export const ENEMY_FADE_TIME = 0.6;
export const ENEMY_FADE_RATIO = 0.02;

export const BASE_PROPERTIES: [...ShipSnapshot, ...WeaponSnapshot] = [
  2, // Rez

  // 1-5
  0, // Rez Save
  1, // Damage Taken
  0, // Damage Taken From Gas
  40, // Gas
  1, // Gas Cost - DEAD

  // 6-10
  5, // Gas Regen
  1, // Item Mixture Quality
  0.1, // Item Drop Rate
  5, // KG
  1, // Resolve

  // 11-15
  50, // HP
  3, // HP Regen
  0.5, // Spin Damage
  1, // Spin Speed
  0.7, // Spin Time

  // 16-17
  2.4, // Strafe Speed
  0.65, // Aim Time

  // WPN 0   (18)
  1, // Bullet Count

  // WPN 1-5 (19-23)
  0.05, // Crit Chance
  2, // Crit Multiplier
  1, // Damage
  6, // Speed
  8, // Rate

  // WPN 6-7   (24/25)
  0, // Bullet Spread
  0, // KG
];
