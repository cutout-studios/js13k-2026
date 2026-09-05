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
  heading: XYZ,
  weapons: Weapon[],
  sequence: ActionSequencer<Ship>,
  damages: Resources,
  _snapshot: ShipSnapshot,
  _optionsIndex: number,
];

export type Resources = [
  hp: number,
  gas: number,
  gasSegments: number,
  rez: number,
  invulnerable: 0 | 1,
  ejecting: 0 | 1,
  countering: 0 | 1,
  flinching: 0 | 1,
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
  gasEjectDelay: number,
  gasRegen: number,
  gasCans: number,
  itemMixtureQuality: number,
  itemDropRate: number,

  // 11-15
  levelQuality: number,
  lowestResource: number,
  kg: number,
  resolve: number,
  hp: number,

  // 16-20
  regen: number,
  spinDamage: number,
  spinHandling: number,
  spinTime: number,
  strafeSpeed: number,

  // 21
  aimSpeed: number,
];

export type Weapon = [
  object: XOObject,
  heading: XYZ,
  bullets: BulletGroup,
  sequence: ActionSequencer<Ship>,
  _snapshot: WeaponSnapshot,
];

export type WeaponSnapshot = [
  // 0
  bulletCount: number,

  // 1-5
  bulletCritChance: number,
  bulletCritDamage: number,
  bulletDamage: number,
  bulletLifetime: number,
  bulletRate: number,

  // 6
  bulletSpread: number,
];

export type Bullet = [
  object: XOObject,
  heading: XYZ,
  sequence: ActionSequencer<Bullet>,
  lifetime: number,
];

export type BulletGroup = [
  bullets: Bullet[],
  instanceGroup: XOObject[],
];
