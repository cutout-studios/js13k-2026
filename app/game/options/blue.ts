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

import { createPrism, createSphere, X_AXIS } from "~/3D";
import { _ } from "~/alias";

import { EASE_OUT } from "../curves.ts";
import { blueWeaponSound } from "../sounds.ts";
import {
  defaultBulletSequencerFactory,
  defaultShipSequencerFactory,
  defaultWeaponSequencerFactory,
} from "./defaults.ts";
import { ColorOptions } from "./types.ts";

export default [
  "BLUE",
  0x29A9D4FF,
  [
    [
      [[], createSphere(0.52, 32)],
      [
        [[0, -0.30, 0.42], [X_AXIS, 0.57]],
        createPrism([0.09, 0.09, 0.03], 16),
      ],
    ],
    [
      [[8, [0.2, 0.3]], [11, [40, 250]], [16, [0.5, 0.8]]],
      defaultShipSequencerFactory(_, _, (t) => EASE_OUT(t) ** .8),
      [
        [[3, [7, 27]], [4, [5.5, 5.5]], [5, [.7, 1.2]]],
        defaultWeaponSequencerFactory,
        [0, -0.30, 0.42],
        [
          createPrism([0.018, 0.018, 0.1], 12),
          defaultBulletSequencerFactory,
          blueWeaponSound,
        ],
      ],
    ],
    [1, 3],
  ],
  [
    [[8, 20], 1, 1, [0.7, 1.2], [3, 8]],
    [
      [0, 11, "x", [1.1, 2.5]], // Shield
      [0, 2, "x", [0.98, 0.7]], // Damage Taken
      [2, 0, "+", [1, 4]], // Armor
      [2, 3, "+", [0.02, 0.3]], // Damage Taken From Gas
    ],
  ],
] as ColorOptions;
