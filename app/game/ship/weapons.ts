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

import { doTimes, spliceTable } from "~/common";
import {
  addXYZ,
  createObject,
  createPaintMaterialWithPalette as paint,
  createSphere,
  normalizeXYZ,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
  XOGeometry,
  XYZ,
} from "~/3D";
import { ActionSchedule, createActionSequencer } from "~/clock";

import { weaponSound } from "./sounds.ts";
import { BaseStatOverride } from "../options/types.ts";
import { levelRollOverrides } from "../world/levels.ts";

import { Bullet, Weapon, WeaponSnapshot } from "./types.ts";
import {
  _THREE_ZEROS,
  BULLET_SPEED,
  WEAPON_BASE_PROPERTIES,
} from "./constants.ts";

export const DEFAULT_BULLET_GEOMETRY = [
  0.05,
  createSphere(0.05, 6),
] as XOGeometry;

export const DEFAULT_WEAPON_SCHEDULE = (
  bulletRate: number,
  bulletColor: number,
  bulletGeometry = DEFAULT_BULLET_GEOMETRY,
  handlesOwnBullets = true,
): ActionSchedule<Weapon> => [[
  (weapon: Weapon) => {
    const [[coordinates], heading, [bullets, instanceGroup], , snapshot] =
        weapon,
      [count, , , , lifetime] = snapshot,
      origin = readOrigin(coordinates);

    doTimes(count, () => {
      const direction = normalizeXYZ(
          subtractXYZ(heading, readOrigin(coordinates)),
        ),
        bulletObject = createObject(
          [origin],
          bulletGeometry,
          paint(bulletColor),
        ),
        bullet: Bullet = [
          bulletObject,
          createActionSequencer([
            [(self: Bullet, tickLength: number) =>
              setOrigin(
                self[0][0],
                addXYZ(
                  readOrigin(self[0][0]),
                  scaleXYZ(direction, tickLength * BULLET_SPEED),
                ),
              )],
          ], lifetime / .016), // Estimate. 1frame ~= 16ms
        ]; // TODO!: we can bake the lifetime into the action sequence

      bullets.push(bullet);
      instanceGroup.push(bullet[0]);

      weaponSound();
    });
  },
], [
  handlesOwnBullets
    ? ([, , bullets]: Weapon, tickLength: number) => {
      const bulletsToCull = [] as number[];

      doTimes(bullets[0], (bullet: Bullet, index: number) => {
        if (!bullet[1](bullet, tickLength)) bulletsToCull.push(index);
      });

      spliceTable(bullets, bulletsToCull);
    }
    : () => {},
  1 / bulletRate,
]];

export const createWeapon = (
  value: number,
  [overrides, schedule = DEFAULT_WEAPON_SCHEDULE(1, value)]: [
    BaseStatOverride[],
    ActionSchedule<Weapon> | undefined,
  ],
  level = 1,
): Weapon => [
  createObject(), // TODO!: wrong, should be the ship's coordinates
  _THREE_ZEROS() as XYZ, // TODO!: wrong, should be the ship's heading
  [[], []],
  createActionSequencer(schedule),
  levelRollOverrides(
    WEAPON_BASE_PROPERTIES,
    overrides,
    level,
  ) as WeaponSnapshot,
];
