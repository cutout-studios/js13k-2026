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
  invulnerable: 0 | 1,
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

  // 6-8
  gasRegen: number,
  itemMixtureQuality: number,
  itemDropRate: number,

  // 9-11
  kg: number,
  resolve: number,
  hp: number,

  // 12-15
  regen: number,
  spinDamage: number,
  spinSpeed: number,
  spinTime: number,

  // 16
  strafeSpeed: number,

  // 17
  aimSpeed: number,
];

export type Weapon = [
  object: XOObject,
  bullets: BulletGroup,
  sequence: ActionSequencer<Ship>,
  _snapshot: WeaponSnapshot,
  _optionsIndex: number,
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

  // 6
  bulletSpread: number,
];

export type Bullet = [
  object: XOObject,
  sequence: ActionSequencer<Bullet>,
];

export type BulletGroup = [
  bullets: Bullet[],
  instanceGroup: XOObject[],
];
