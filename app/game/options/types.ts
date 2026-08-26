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

import { Band } from "~/random";
import { XOGeometry, XOOrientation } from "~/3D";
import { ActionSchedule } from "~/clock";

import { Ship, Weapon } from "../ship/types.ts";

export type ColorOptions = [
  name: string,
  value: number,
  ship: [
    shape: [orientation: XOOrientation, geometry: XOGeometry][],
    overrides: BaseStatOverride[],
    sequence: ActionSchedule<Ship>,
    weapon: [
      overrides: BaseStatOverride[],
      sequence: ActionSchedule<Weapon>,
    ],
    countBand: Band,
  ],
  itemModifiers: ModifierOptions[],
];

export type BaseStatOverride = [statID: number, band: Band];

export type ModifierOptions = [
  itemTypeID: number,
  statID: number,
  modifierOperation: "*" | "x",
  modifierBand: Band,
];
