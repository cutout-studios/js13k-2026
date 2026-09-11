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

import { createPyramid, Z_AXIS } from "~/3D";
import { _, NO_OP } from "~/alias";
import { createActionSequencer } from "~/clock";

import { defaultWeaponSound } from "../sounds.ts";
import {
  defaultBulletGeometry,
  defaultBulletSequencerFactory,
  defaultWeaponSequencerFactory,
} from "./defaults.ts";
import { ColorOptions } from "./types.ts";

export default [
  "WHITE", // player ship - no stat rolling, no AI sequencer
  0xFFFFFFFF,
  [
    [ // shape: [orientation, geometry][]
      [[[0.2, 0, -0.22], [[0, 1, 0], 1.9]], createPyramid([0.1, 0.02, 0.2], 4)], // right wing
      [
        [[-0.2, 0, -0.22], [[0, 1, 0], -1.9]],
        createPyramid([0.1, 0.02, 0.2], 4),
      ], // left wing
      [[_, [Z_AXIS, -1.57]], createPyramid([0.05, 0.15, 0.27], 6)], // hull
      [[[0, 0, -0.28], _], createPyramid([0.03, 0.03, 0.04], 8)], // tail
    ],
    [], // overrides: none, player stats come straight from BASE_PROPERTIES
    () => createActionSequencer([[NO_OP]]), // sequenceFactory: idle, player is hand-flown
    [ // weapons: [overrides, sequenceFactory, mount, bullet, sight?][]
      [[], defaultWeaponSequencerFactory, [0.3, 0, -0.26], [
        defaultBulletGeometry,
        defaultBulletSequencerFactory(),
        defaultWeaponSound,
      ]], // right gun
      [[], defaultWeaponSequencerFactory, [-0.3, 0, -0.26], [
        defaultBulletGeometry,
        defaultBulletSequencerFactory(),
        defaultWeaponSound,
      ]], // left gun
    ],
    [1, 1], // countBand: always exactly 1 ship
  ],
  [
    [[1, 1], 0, 1, [8, 8], [1, 1]], // item base: kg, baseModifiers, bulletCount, bulletRate, bulletDamage (player has no items)
    [], // modifiers: none
  ],
] as ColorOptions;
