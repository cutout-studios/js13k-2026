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

import { max } from "~/alias";
import { doTimes } from "~/common";
import {
  addXYZ,
  createObject,
  createSphere,
  readOrigin,
  scaleXYZ,
  setOrigin,
  XOGeometry,
  XYZ,
  Z_AXIS,
} from "~/3D";
import { ActionSchedule, createActionSequencer } from "~/clock";

import { BaseStatOverride } from "../options/types.ts";
import { levelRollOverrides } from "../world/levels.ts";

import { Bullet, Weapon, WeaponSnapshot } from "./types.ts";
import { _THREE_ZEROS, WEAPON_BASE_PROPERTIES } from "./constants.ts";

const DEFAULT_BULLET_GEOMETRY = [0.05, createSphere(0.05, 6)] as XOGeometry;

const DEFAULT_WEAPON_SCHEDULE = (
  bulletRate: number,
  bulletGeometry = DEFAULT_BULLET_GEOMETRY,
): ActionSchedule<Weapon> => [[
  (weapon: Weapon) => {
    const [[coordinates], heading, [bullets, instanceGroup], , snapshot] =
        weapon,
      [count, , , , lifetime, , spread] = snapshot,
      origin = readOrigin(coordinates);
    doTimes(count, (index) => {
      const offset = spread * (index / max(1, count - 1) - 0.5),
        direction = [heading[0] + offset, heading[1], heading[2]] as XYZ,
        bulletObject = createObject([origin, [Z_AXIS, offset]], bulletGeometry),
        bullet: Bullet = [
          bulletObject,
          createActionSequencer([
            [(self: Bullet, tickLength: number) =>
              setOrigin(
                self[0][0],
                addXYZ(readOrigin(self[0][0]), scaleXYZ(direction, tickLength)),
              )],
          ], lifetime / .016), // Estimate. 1frame ~= 16ms
        ];
      bullets.push(bullet);
      instanceGroup.push(bullet[0]);
    });
  },
  bulletRate,
], [
  ([, , [bullets]]: Weapon, tickLength: number) =>
    bullets.forEach((bullet: Bullet) => bullet[1](bullet, tickLength)),
]];

export const createWeapon = (
  [overrides, schedule = DEFAULT_WEAPON_SCHEDULE(1)]: [
    BaseStatOverride[],
    ActionSchedule<Weapon> | undefined,
  ],
  level = 1,
): Weapon => [
  createObject(),
  _THREE_ZEROS() as XYZ,
  [[], []],
  createActionSequencer(schedule),
  levelRollOverrides(
    WEAPON_BASE_PROPERTIES,
    overrides,
    level,
  ) as WeaponSnapshot,
];
