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

import {
  createObject,
  createPaintMaterialWithPalette as paint,
  createPrism,
  createPyramid,
  flattenObjects,
} from "~/3D";
import { _ } from "~/alias";
import { createActionSequencer } from "~/clock";

import { createPlayerAimAction } from "../actions.ts";

import { Ship } from "../ship/types.ts";
import { purpleWeaponSound } from "../sounds.ts";

import {
  createFireWeaponsAction,
  defaultBulletGeometry,
  defaultBulletSequencerFactory,
  defaultWeaponSequencerFactory,
} from "./defaults.ts";
import { ColorOptions } from "./types.ts";

export const purpleSequencerFactory = (
  _ship: Ship,
) => {
  const aimAction = createPlayerAimAction(_ship),
    fireWeapons = createFireWeaponsAction(_ship);

  return createActionSequencer([
    [(_ship: Ship, ...args) => {
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }],
  ]);
};

export default [
  "PURPLE",
  0x8434D4FF,
  [
    [[[], createPyramid([0.25, 0.25, 0.25])]], // shape: hull only
    [ // overrides
      [8, [0.06, 0.1]], // Item Drop Rate
      [11, [6, 70]], // HP
      [17, [0.3, 0.15]], // Aim Time
      [16, [0, 0]], // Strafe Speed
    ],
    purpleSequencerFactory, // sequenceFactory
    [ // weapons: [overrides, sequenceFactory, mount, bullet, sight?][]
      [
        [
          [1, [0.15, 0.35]], // Bullet Crit Chance
          [2, [2.5, 5.0]], // Bullet Crit Damage
          [3, [4, 60]], // Bullet Damage
          [4, [30, 32]], // Bullet Speed
          [5, [0.2, 0.3]], // Bullet Rate
        ],
        defaultWeaponSequencerFactory,
        _, // mount: none, single centered gun
        [
          defaultBulletGeometry,
          defaultBulletSequencerFactory(),
          purpleWeaponSound,
        ], // bullet
        [ // sight: laser
          flattenObjects(
            createObject(
              [[0, 0, 30]],
              createPrism([0.002, 0.002, 30], 6),
            ),
          )[1],
          paint(0x8434D444),
        ],
      ],
    ],
    [3, 5], // countBand
  ],
  [
    [[0, 0], 0, 1, [0.08, 0.4], [20, 100]], // item base: kg, baseModifiers, bulletCount, bulletRate, bulletDamage
    [
      [0, 22, "x", [1.7, 3]], // Bullet Speed
      [0, 19, "+", [0.1, 0.5]], // Bullet Crit Chance
      [2, 17, "+", [-0.1, -0.65]], // Aim Time
      [3, 9, "x", [0.7, 0.2]], // -KG
    ],
  ],
] as ColorOptions;
