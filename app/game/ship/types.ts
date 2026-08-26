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

import { XOObject, XYZ } from "~/3D";

export type SequenceFunction<T> = (
  payload: T,
  tickLength: number,
) => T | undefined;

export type Ship = [
  object: XOObject,
  heading: XYZ,
  weapons: Weapon[],
  sequence: SequenceFunction<Ship>,
  damages: Resources,
  _snapshot: ShipSnapshot,
];

export type Resources = [
  shield: number,
  fuel?: number,
  fuelSegments?: number,
  armor?: number,
  invulnerable?: boolean,
];

export type ShipSnapshot = [
  armor: number,
  // 0
  armorSave: number,
  damageTaken: number,
  damageTakenFromFuel: number,
  fuel: number,
  fuelCost: number,
  // 5
  fuelEjectDelay: number,
  fuelRegen: number,
  fuelSegments: number,
  itemMixtureQuality: number,
  itemQuality: number,
  // 10
  levelQuality: number,
  lowestResource: number,
  mass: number,
  resolve: number,
  shield: number,
  // 15
  shieldRegen: number,
  spinDamage: number,
  spinHandling: number,
  spinTime: number,
  strafeSpeed: number,
  // 20
  trackingSpeed: number,
];

export type Weapon = [
  object: XOObject,
  heading: XYZ,
  bullets: BulletGroup,
  sequence: SequenceFunction<Weapon>,
  _snapshot: WeaponSnapshot,
];

export type WeaponSnapshot = [
  bulletCount: number,
  // 0
  bulletCritChance: number,
  bulletCritDamage: number,
  bulletDamage: number,
  bulletLifetime: number,
  bulletRate: number,
  // 5
  bulletSpread: number,
];

export type Bullet = [object: XOObject, sequence: SequenceFunction<Bullet>];

export type BulletGroup = [
  bullets: Bullet[],
  instanceGroup: XOObject[],
];
