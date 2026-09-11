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
import { ActionSequencer, createActionSequencer } from "~/clock";

import { Ship, WeaponSnapshot } from "../ship/types.ts";
import { redWeaponSound } from "../sounds.ts";

import {
  defaultBulletSequencerFactory,
  defaultShipSequencerFactory,
} from "./defaults.ts";
import { ColorOptions } from "./types.ts";

export const redWeaponSequenceFactory = (
  fire: (ship: Ship) => void,
  snapshot: WeaponSnapshot,
): ActionSequencer<Ship> =>
  createActionSequencer([
    [NO_OP, 0.85 / snapshot[5]],
    [fire],
    [NO_OP, 0.15 / snapshot[5]],
    [fire],
  ]);

export default [
  0xEE3030FF,
  [
    [[
      [_, [Z_AXIS, -1.61]],
      createPyramid([0.11, 0.09, 0.4], 3),
    ]],
    [[8, [0.1, 0.15]], [11, [8, 108]], [16, [1, 2]], [17, [
      4,
      2.5,
    ]]],
    defaultShipSequencerFactory(),
    [[
      [[0, [2, 2]], [3, [1, 8]], [5, [0.7, 3.5]], [6, [0.02, 0.06]]],
      redWeaponSequenceFactory,
      _,
      [
        createPyramid([0.008, 0.008, 0.1], 4),
        defaultBulletSequencerFactory(),
        redWeaponSound,
      ],
    ]],
    [3, 6],
  ],
  [
    [[2, 4], 0, 2, [2, 4], [2, 12]],
    [
      [0, 21, "x", [1.25, 3.5]], // Bullet Damage
      [0, 4, "+", [3, 15]], // Gas
      [0, 22, "x", [1.1, 4]], // Bullet Speed
      [3, 6, "x", [1.2, 2.2]], // Gas Refill
    ],
  ],
] as ColorOptions;
