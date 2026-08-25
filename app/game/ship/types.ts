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

type SequenceFunction<T> = (payload: T, tickLength: number) => T;

export type Ship = [
  object: XOObject,
  heading: XYZ,
  weapons: Weapon[],
  sequence: SequenceFunction<Ship>,
  damages: Resources,
  statBlock: ShipStatSnapshot[],
];

export type Weapon = [
  object: XOObject,
  heading: XYZ,
  bullets: BulletGroup,
  sequence: SequenceFunction<Weapon>,
  statBlock: WeaponStatSnapshot[],
];

export type Bullet = [object: XOObject, sequence: SequenceFunction<Bullet>];

export type BulletGroup = [
  bullets: Bullet[],
  instanceGroup: XOObject[],
];

export type Resources = [shield: number, fuel?: number, armor?: number];

export type Item = [
  object: XOObject,
  colorID: number,
  typeID: number,
  rank: number,
  modifiers: [dataID: number, value: number][],
  data: number[],
];

export type ShipStatSnapshot = [
  armor: number,
  armorSave: number,
  damageTaken: number,
  damageTakenFromFuel: number,
  fuel: number,
  fuelCost: number,
  fuelEjectDelay: number,
  fuelRegen: number,
  fuelSegments: number,
  itemMixtureQuality: number,
  itemQuality: number,
  levelQuality: number,
  lowestResource: number,
  mass: number,
  resolve: number,
  shield: number,
  shieldRegen: number,
  spinDamage: number,
  spinHandling: number,
  spinTime: number,
  strafeSpeed: number,
  trackingSpeed: number,
];

export type WeaponStatSnapshot = [
  bulletCount: number,
  bulletCritChance: number,
  bulletCritDamage: number,
  bulletDamage: number,
  bulletLifetime: number,
  bulletRate: number,
  bulletSpread: number,
];
