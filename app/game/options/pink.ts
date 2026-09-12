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

import { createSphere } from "~/3D";
import { _ } from "~/alias";
import { Band, repeat, spread } from "~/common";

import { pinkWeaponSound } from "../sounds.ts";

import {
  defaultBulletSequencerFactory,
  defaultShipSequencerFactory,
  defaultWeaponSequencerFactory,
} from "./defaults.ts";
import { ColorOptions } from "./types.ts";

export default [
  "PINK",
  0xD4349FFF,
  [
    [[[], createSphere(0.10, 20)]], // shape: hull only
    [ // overrides
      [8, [0.01, 0.03]], // Item Drop Rate
      [11, [2, 25]], // HP
      [16, [0.5, 0.9]], // Strafe Speed
      [17, [1, 0.8]], // Aim Time
    ],
    defaultShipSequencerFactory(), // sequenceFactory
    [ // weapons: [overrides, sequenceFactory, mount, bullet, sight?][]
      [
        [
          [3, [1, 5]], // Bullet Damage
          [4, [1, 2]], // Bullet Speed
          [5, [0.7, 1.5]], // Bullet Rate
          [6, [0.25, 0.5]], // Bullet Spread
        ],
        defaultWeaponSequencerFactory,
        _, // mount: none, single centered gun
        [
          createSphere(0.03),
          defaultBulletSequencerFactory(
            repeat(3, spread(0.2)) as [Band, Band, Band],
          ),
          pinkWeaponSound,
        ], // bullet
      ],
    ],
    [9, 25], // countBand
  ],
  [
    [[4, 10], 0, 9, [1.5, 7], [1, 5]], // item base: kg, baseModifiers, bulletCount, bulletRate, bulletDamage
    [
      [0, 7, "x", [1.5, 2.5]], // Restore Potency
      [0, 8, "+", [0.05, 0.2]], // Drop Rate
      [0, 18, "+", [2, 5]], // Bullet Count
      [2, 1, "+", [0.2, 0.6]], // Rez Recovery
    ],
  ],
] as ColorOptions;
