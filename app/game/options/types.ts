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

import { XOGeometry, XOMaterial, XOOrientation, XYZ } from "~/3D";
import { ActionSequencer } from "~/clock";
import { Band } from "~/common";

import { Bullet, Ship, WeaponSnapshot } from "../ship/types.ts";

export type ColorOptions = [
  name: string,
  value: number,
  ship: ShipOptions,
  item: ItemOptions,
];

type ShipOptions = [
  shape: [
    orientation: XOOrientation,
    geometry: XOGeometry,
    material?: (color: number) => XOMaterial,
  ][],
  overrides: BaseStatOverride[],
  sequenceFactory: (
    ship: Ship,
    arcPoint?: [Band, Band, Band],
  ) => ActionSequencer<Ship>,
  weapons: [
    overrides: BaseStatOverride[],
    sequenceFactory: (
      fire: (ship: Ship) => void,
      snapshot: WeaponSnapshot,
    ) => ActionSequencer<Ship>,
    mount?: XYZ,
    bullet?: [
      geometry: XOGeometry,
      sequenceFactory: (
        bullet: Bullet,
        speed: number,
        isEnemy: boolean,
      ) => ActionSequencer<Bullet>,
      sound?: (pan: number, volume: number) => void,
    ],
    sight?: [geometry: XOGeometry, material?: XOMaterial],
  ][],
  countBand: Band,
];

export type BaseStatOverride = [statID: number, band: Band];

export type ItemOptions = [
  base: [
    kg: Band,
    baseModifiers: number,
    bulletCount: number,
    bulletRate: Band,
    bulletDamage: Band,
  ],
  modifiers: ModifierOptions[],
];

export type ModifierOptions = [
  itemTypeID: number,
  propertyID: number,
  modifierOperation: "+" | "x",
  modifierBand: Band,
];
