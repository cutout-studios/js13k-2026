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
import { ActionSequencer } from "~/clock";

export type Ship = [
  object: XOObject,
  aim: XYZ,
  weapons: Weapon[],
  sequence: ActionSequencer<Ship>,
  damages: Resources,
  _snapshot: ShipSnapshot,
  _optionsIndex: number,
];

export type Resources = [
  hp: number,
  gas: number,
  rez: number,
  invulnerable: number, // player: 0 | 1; enemy: seconds elapsed since death (0 = alive)
  countering: 0 | 1,
  recovering: 0 | 1,
  roll: number,
];

export type ShipSnapshot = [
  rez: number,

  // 1-5
  rezSave: number,
  damageTaken: number,
  damageTakenFromGas: number,
  gasCanSize: number,
  gasCost: number,

  // 6-10
  gasRegen: number,
  itemMixtureQuality: number,
  itemDropRate: number,
  kg: number,
  resolve: number,

  // 11-15
  hp: number,
  regen: number,
  spinDamage: number,
  spinSpeed: number,
  spinTime: number,

  // 16-17
  strafeSpeed: number,
  aimTime: number,
];

export type Weapon = [
  object: XOObject,
  bullets: BulletGroup,
  sequence: ActionSequencer<Ship>,
  _snapshot: WeaponSnapshot,
  _optionsIndex: number,

  mountCoordinates?: Float32Array,
];

export type WeaponSnapshot = [
  // 0
  bulletAmount: number,

  // 1-5
  bulletCritChance: number,
  bulletCritDamage: number,
  bulletDamage: number,
  bulletSpeed: number,
  bulletRate: number,

  // 6-7
  bulletSpread: number,

  kg: number,
];

export type Bullet = [
  object: XOObject,
  sequence: ActionSequencer<Bullet>,
  ship?: Ship,
  weaponIndex?: number,
];

export type BulletGroup = [
  bullets: Bullet[],
  instanceGroup: XOObject[],
];
