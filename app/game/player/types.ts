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

import { XOObject } from "~/3D";

import { ActionSequencer } from "~/clock";
import { Resources, Ship } from "../ship/types.ts";

export type Player = [
  ship: Ship,
  levelAssigments: Resources,
  inventory: [
    item: Item,
    equipped?: boolean,
  ][],
];

export type Item = [
  object: XOObject,
  sequence: ActionSequencer<Item>,
  typeID: number,
  colorID: number,
  rank: number,
  modifiers: [propertyID: number, type: "+" | "x", value: number][],
  baseMass: number,
  baseWeapon?: [bulletCount: number, bulletRate: number, bulletDamage: number],
];
