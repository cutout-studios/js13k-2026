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

import { ShipSnapshot, WeaponSnapshot } from "./types.ts";

export const SHIP_PROPERTY_NAMES = [
  "Armor",
  "Armor Save",
  "Damage Taken",
  "Damage Taken From Fuel",
  "Fuel",
  "Fuel Cost",
  "Fuel Eject Delay",
  "Fuel Regen",
  "Fuel Segments",
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
  "Tracking Speed",
];

export const SHIP_BASE_PROPERTIES: ShipSnapshot = [
  2, // Armor
  0, // Armor Save
  1, // Damage Taken
  0, // Damage Taken From Fuel
  30, // Fuel
  0.1, // Fuel Cost
  0, // Fuel Eject Delay
  10, // Fuel Regen
  1, // Fuel Segments
  1, // Item Mixture Quality
  1, // Item Quality
  1.2, // Level Quality
  0, // Lowest Resource
  1, // Mass
  0, // Resolve
  40, // Shield
  10, // Shield Regen
  1, // Spin Damage
  0.1, // Spin Handling
  1.5, // Spin Time
  2.4, // Strafe Speed
  0.8, // Tracking Speed
];

export const WEAPON_PROPERTY_NAMES = [
  "Bullet Count",
  "Bullet Crit Chance",
  "Bullet Crit Damage",
  "Bullet Damage",
  "Bullet Lifetime",
  "Bullet Rate",
  "Bullet Spread",
];

export const WEAPON_BASE_PROPERTIES: WeaponSnapshot = [
  1, // Bullet Count
  0.05, // Bullet Crit Chance
  1, // Bullet Crit Damage
  1, // Bullet Damage
  1, // Bullet Lifetime
  8, // Bullet Rate
  1, // Bullet Spread
];

export const BULLET_SPEED = 12;
