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
    [ // shape: [orientation, geometry, material][]
      [[], createSphere(0.52, 32)], // hull
      [
        [[0, -0.30, 0.42], [X_AXIS, 0.57]],
        createPrism([0.09, 0.09, 0.03], 16),
      ], // gun barrel
    ],
    [ // overrides
      [8, [0.2, 0.3]], // Item Drop Rate
      [11, [80, 750]], // HP
      [16, [0.5, 0.8]], // Strafe Speed
      [17, [1, 0.8]], // Aim Time
    ],
    defaultShipSequencerFactory(_, (t) => EASE_OUT(t) ** .8), // sequenceFactory
    [ // weapons: [overrides, sequenceFactory, mount, bullet, sight?][]
      [
        [
          [3, [10, 30]], // Bullet Damage
          [4, [5.5, 5.5]], // Bullet Speed
          [5, [.7, 1.2]], // Bullet Rate
        ],
        defaultWeaponSequencerFactory,
        [0, -0.30, 0.42], // mount
        [
          createPrism([0.018, 0.018, 0.1], 12),
          defaultBulletSequencerFactory(),
          blueWeaponSound,
        ], // bullet
      ],
    ],
    [1, 1], // countBand
  ],
  [
    [[6, 12], 1, 1, [0.7, 1.2], [6, 12]], // item base: kg, baseModifiers, bulletCount, bulletRate, bulletDamage
    [
      [0, 11, "x", [2, 4]], // HP
      [0, 12, "x", [2, 4]], // HP Regen
      [2, 0, "+", [1, 4]], // Rez
      [2, 2, "+", [-2, -10]], // Damage Reduction
    ],
  ],
] as ColorOptions;
