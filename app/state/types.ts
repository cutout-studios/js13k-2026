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

export type GameState = [player: PlayerState, world: WorldState];

export type PlayerState = [
  ship: PlayerShip,
  sheet: PlayerSheet,
  inventory: Item[],
];

export type PlayerResources = [shield: number, fuel: number, armor: number];

// TODO
type _Bullets = [ActionSequence[], XOObject[]];
type _Weapon = [ActionSequence, _Bullets];

export type PlayerShip = {
  body: [object: XOObject, aim: XYZ, roll: number];
  damage: PlayerResources;
  weapons: [leftWeapon: _Weapon, rightWeapon: _Weapon];
};

export type PlayerEquipment = [
  leftWing: number | undefined,
  rightWing: number | undefined,
  body: number | undefined,
  engine: number | undefined,
];

export type PlayerSheet = [
  levels: PlayerResources,
  equipment: PlayerEquipment,
  statistics: number[],
];

export type PlayerStatistic = [
  name: string,
  type: number,
  magnitude: number,
  base: number,
];

export type WorldState = [
  stage: number,
  wave: number,
  distance: number,
  client: Set<string>,
];

export type Color = [
  name: string,
  hex: number,
  density: number,
  enemy: [
    count: number,
    health: number,
    speed: number,
    drop: number,
    parts: ConstructorParameters<typeof XOObject>[],
  ],
  weapon: [
    count: number,
    damage: number,
    life: number,
    rate: number,
    bonusAffix: number,
    cost: number,
    bulletPattern: number,
  ],
  // index 0 = global, index n + 1 = affixes for ITEM_TYPES[n]
  affixes: Array<number[] | undefined>,
];

export type Item = [
  color: number,
  gear: number,
  rank: number,
  mass: number,
  affixes: ItemAffix[],

  // weapon information
  count?: number,
  damage?: number,
  life?: number,
  rate?: number,
  bonusAffix?: number,
  cost?: number,
  bulletPattern?: number,
];

export type ItemAffix = [type: number, value: number];
