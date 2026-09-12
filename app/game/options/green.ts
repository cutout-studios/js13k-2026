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
    [ // shape: [orientation, geometry, material][]
      [[], createSphere(0.20, 24)], // hull
      [[[0.2, -0.08, 0.15], [[0, 1, -1], 1.25]], GREEN_PRONG], // right prong
      [[[-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]], GREEN_PRONG], // left prong
    ],
    [ // overrides
      [11, [8, 60]], // HP
      [16, [1.6, 3]], // Strafe Speed
    ],
    defaultShipSequencerFactory(() => 0), // sequenceFactory: no pause between passes
    [ // weapons: [overrides, sequenceFactory, mount, bullet, sight?][]
      [
        [
          [3, [0.25, 1]], // Bullet Damage
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
          [3, [0.25, 1]], // Bullet Damage
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
    [3, 7], // countBand
  ],
  [
    [[1, 3], 0, 1, [10, 21], [0.25, 1]], // item base: kg, baseModifiers, bulletCount, bulletRate, bulletDamage
    [
      [0, 16, "x", [1.7, 3]], // Speed
      [0, 23, "x", [1.7, 3]], // Bullet Rate
      [0, 6, "x", [2, 4]], // Gas Refill
      [3, 14, "x", [1.7, 3]], // Spin Speed
    ],
  ],
] as ColorOptions;
