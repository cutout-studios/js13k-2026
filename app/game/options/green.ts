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
    [
      [[], createSphere(0.20, 24)],
      [[[0.2, -0.08, 0.15], [[0, 1, -1], 1.25]], GREEN_PRONG],
      [[[-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]], GREEN_PRONG],
    ],
    [[11, [4, 20]], [16, [1.2, 2.5]]],
    defaultShipSequencerFactory(() => 0),
    [[
      [[3, [0.07, 0.5]], [4, [2, 3]], [5, [12, 21]], [6, [0.05, 0.1]]],
      defaultWeaponSequencerFactory,
      [0.2, -0.08, 0.15],
      [
        createPyramid([0.02, 0.002, 0.015], 4),
        defaultBulletSequencerFactory,
        NO_OP,
      ],
    ], [
      [[3, [0.07, 0.5]], [4, [2, 3]], [5, [12, 21]], [6, [0.05, 0.1]]],
      defaultWeaponSequencerFactory,
      [-0.2, -0.08, 0.15],
      [
        createPyramid([0.02, 0.002, 0.015], 4),
        defaultBulletSequencerFactory,
        NO_OP,
      ],
    ]],
    [4, 7],
  ],
  [
    [[2, 5], 0, 1, [12, 21], [0.2, 2]],
    [
      [0, 5, "x", [0.95, 0.2]], // Gas Cost
      [0, 16, "x", [1.05, 2.3]], // Speed
      [0, 23, "x", [1.2, 3]], // Bullet Rate
      [3, 15, "+", [0.03, 0.2]], // Spin Time
    ],
  ],
] as ColorOptions;
