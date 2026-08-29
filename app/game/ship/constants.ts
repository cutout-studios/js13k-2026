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

export const PROPERTY_NAMES =
  "ARMOR,ARMOR SAVE,DAMAGE TAKEN,DAMAGE TAKEN FROM FUEL,FUEL,FUEL COST,FUEL EJECT DELAY,FUEL REGEN,FUEL SEGMENTS,MIX QUALITY,DROP RATE,LEVEL QUALITY,LOWEST RESOURCE,MASS,RESOLVE,SHIELD,SHIELD REGEN,SPIN DAMAGE,SPIN HANDLING,SPIN TIME,STRAFE SPEED,TRACKING SPEED,BULLET COUNT,BULLET CRIT CHANCE,BULLET CRIT DAMAGE,BULLET DAMAGE,BULLET LIFETIME,BULLET RATE,BULLET SPREAD"
    .split(",");

// TODO: move these to game config
export const SHIP_BASE_PROPERTIES: ShipSnapshot = [
  2, // Armor
  0, // Armor Save
  1, // Damage Taken
  0, // Damage Taken From Fuel
  20, // Fuel
  0.1, // Fuel Cost
  0, // Fuel Eject Delay
  7, // Fuel Regen
  2, // Fuel Segments
  1, // Item Mixture Quality
  0.05, // Item Drop Rate
  1.2, // Level Quality
  0, // Lowest Resource
  1, // Mass
  0, // Resolve
  40, // Shield
  5, // Shield Regen
  1, // Spin Damage
  0.1, // Spin Handling
  1.5, // Spin Time
  2.4, // Strafe Speed
  0.8, // Tracking Speed
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
