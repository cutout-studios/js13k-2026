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

import { XOGeometry, XOMaterial, XOObject, XOOrientation, XYZ } from "~/3D";

// Game
export type GameState = [player: PlayerState, world: WorldState];

// Player
export type PlayerState = [
  ship: PlayerShip,
  sheet: PlayerSheet,
  inventory: ItemData[],
];

export type PlayerShip = [
  body: [object: XOObject, aim: XYZ],
  weapons: [
    left: WeaponState,
    right: WeaponState,
  ],
  damage: PlayerResources,
];

export type PlayerResources = [shield: number, fuel: number, armor: number];

export type PlayerSheet = [
  levels: PlayerResources,
  equipment: PlayerEquipment,
  data: number[],
];

export type PlayerEquipment = [
  leftWing?: number,
  rightWing?: number,
  body?: number,
  engine?: number,
];

export type PlayerSheetOptions = [
  name: string,
  type: number,
  magnitude: number,
  base: number,
][];

// World
export type WorldState = [
  enemies: WorldEnemyGroupState[],
  items: WorldItem[],
  stage: number,
  wave: number,
  distance: number,
  collection: Set<string>,
];

export type WorldColorOptions = [
  name: string,
  hex: number,
  density: number,
  enemy: [
    count: number,
    health: number,
    speed: number,
    drop: number,
    objects: [
      orientation?: XOOrientation,
      geometry?: XOGeometry,
      material?: XOMaterial,
    ][],
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

// Enemies
export type WorldEnemyGroupState = [
  objects: XOObject[],
  bullets: [XOObject[], BulletSequence[]],
  data: [
    remainingHealth: number,
    damage: number,
    mass: number,
    speed: number,
  ][],
  sequence: (payload: GameState, tickLength: number) => void,
  item: (ItemData | undefined)[],
];

// Items
export type WorldItem = [object: XOObject, data: ItemData];

export type ItemData = [
  color: number,

  gear: number,
  rank: number,
  mass: number,
  affixes: ItemAffix[],

  // (weapon information)
  bulletCount?: number,
  bulletDamage?: number,
  bulletLifetime?: number,
  firingRate?: number,
  bonusAffix?: number,

  firingCost?: number,
  bulletPattern?: number,
];

export type ItemAffix = [type: number, value: number];

// Weapons/Bullets
export type WeaponState = [
  bullets: [XOObject[], BulletSequence[]],
  sequence: (
    payload: PlayerState,
    tickLength: number,
  ) => [XOObject, BulletSequence] | undefined,
];

export type BulletState = [
  objects: XOObject[],
  sequences: BulletSequence[],
];

export type BulletSequence = (
  payload: void,
  tickLength: number,
) => number | undefined;
