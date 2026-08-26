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

import { createObject, XYZ } from "~/3D";
import { ActionSchedule, createActionSequence } from "~/clock";

import { BaseStatOverride } from "../options/types.ts";
import { levelRollOverrides } from "../world/levels.ts";

import { Weapon, WeaponSnapshot } from "./types.ts";
import { _THREE_ZEROS, WEAPON_BASE_PROPERTIES } from "./constants.ts";

export const createWeapon = (
  [overrides, schedule]: [BaseStatOverride[], ActionSchedule<Weapon>],
  level = 1,
): Weapon => [
  createObject(),
  _THREE_ZEROS() as XYZ,
  [[], []],
  createActionSequence(schedule),
  levelRollOverrides(
    WEAPON_BASE_PROPERTIES,
    overrides,
    level,
  ) as WeaponSnapshot,
];
