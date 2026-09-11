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

import { createPyramid, createSphere } from "~/3D";
import { NO_OP } from "~/alias";
import {
  defaultBulletSequencerFactory,
  defaultShipSequencerFactory,
  defaultWeaponSequencerFactory,
} from "./defaults.ts";
import { ColorOptions } from "./types.ts";

const GREEN_PRONG = createPyramid([0.065, 0.065, 0.095], 12);

export default [
  "GREEN",
  0xA0DD27FF,
  [
    [ // shape: [orientation, geometry][]
      [[], createSphere(0.20, 24)], // hull
      [[[0.2, -0.08, 0.15], [[0, 1, -1], 1.25]], GREEN_PRONG], // right prong
      [[[-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]], GREEN_PRONG], // left prong
    ],
    [ // overrides
      [11, [4, 20]], // HP
      [16, [1.2, 2.5]], // Strafe Speed
    ],
    defaultShipSequencerFactory(() => 0), // sequenceFactory: no pause between passes
    [ // weapons: [overrides, sequenceFactory, mount, bullet, sight?][]
      [
        [
          [3, [0.07, 0.5]], // Bullet Damage
          [4, [2, 3]], // Bullet Speed
          [5, [12, 21]], // Bullet Rate
          [6, [0.05, 0.1]], // Bullet Spread
        ],
        defaultWeaponSequencerFactory,
        [0.2, -0.08, 0.15], // mount
        [
          createPyramid([0.02, 0.002, 0.015], 4),
          defaultBulletSequencerFactory(),
          NO_OP,
        ], // bullet
      ],
      [
        [
          [3, [0.07, 0.5]], // Bullet Damage
          [4, [2, 3]], // Bullet Speed
          [5, [12, 21]], // Bullet Rate
          [6, [0.05, 0.1]], // Bullet Spread
        ],
        defaultWeaponSequencerFactory,
        [-0.2, -0.08, 0.15], // mount
        [
          createPyramid([0.02, 0.002, 0.015], 4),
          defaultBulletSequencerFactory(),
          NO_OP,
        ], // bullet
      ],
    ],
    [4, 7], // countBand
  ],
  [
    [[2, 5], 0, 1, [12, 21], [0.2, 2]], // item base: kg, baseModifiers, bulletCount, bulletRate, bulletDamage
    [
      [0, 5, "x", [0.95, 0.2]], // Gas Cost
      [0, 16, "x", [1.05, 2.3]], // Speed
      [0, 23, "x", [1.2, 3]], // Bullet Rate
      [3, 15, "+", [0.03, 0.2]], // Spin Time
    ],
  ],
] as ColorOptions;
