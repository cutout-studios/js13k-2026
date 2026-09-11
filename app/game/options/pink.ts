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
    [[[], createSphere(0.10, 20)]],
    [[8, [0.02, 0.04]], [11, [1, 12]], [16, [0.5, 0.9]]],
    defaultShipSequencerFactory,
    [[
      [[3, [1, 8]], [4, [1, 2]], [5, [0.7, 1.5]], [6, [0.25, 0.5]]],
      defaultWeaponSequencerFactory,
      _,
      [
        createSphere(0.03),
        defaultBulletSequencerFactory(
          repeat(3, spread(0.2)) as [Band, Band, Band],
        ),
        pinkWeaponSound,
      ],
    ]],
    [9, 16],
  ],
  [
    [[0.5, 2], 0, 9, [0.3, 0.9], [1, 4]],
    [
      [0, 7, "x", [1.1, 2.2]], // Item Mixture Quality
      [0, 18, "+", [1, 3]], // Bullet Count
      [0, 1, "+", [0.05, 0.3]], // Armor Save
      [2, 12, "x", [1.1, 2]], // Shield Regen
    ],
  ],
] as ColorOptions;
