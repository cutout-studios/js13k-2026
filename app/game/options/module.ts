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
import { ActionSchedule } from "~/clock";
import { createPrism, createPyramid, createSphere, X_AXIS, Z_AXIS } from "~/3D";
import { controlSequence } from "../player/controls.ts";
import { Ship, Weapon } from "../ship/types.ts";
import { ColorOptions } from "./types.ts";

// TODO: better sequences
const _shipSequenceStub: ActionSchedule<Ship> = [[(ship: Ship) => ship]],
  _weaponSequenceStub: ActionSchedule<Weapon> = [[(weapon: Weapon) => weapon]];

const GREEN_PRONG = [
    0.12,
    createPyramid([0.065, 0.065, 0.095], 12),
  ],
  YELLOW_ARM = [0.32, createPrism([0.2, 0.012, 0.15])];

export default [
  [ // player
    "White",
    0xFFFFFF,
    [
      [[], [], [], []],
      [],
      controlSequence,
      [[], _weaponSequenceStub],
      [1, 1],
    ],
    [],
  ],
  [ // purple: crit/glass
    "Purple",
    0x8434D4,
    [
      [[[], [0.5, createPyramid([0.25, 0.25, 0.125])]]],
      [[16, [7, 60]], [18, [0, 0]], [14, [4, 20]], [4, [18, 25]]],
      _shipSequenceStub,
      [
        [[1, [0.10, 0.25]], [2, [2.0, 3.0]], [5, [1.5, 3]]],
        _weaponSequenceStub,
      ],
      [3, 5],
    ],
    [
      [0, 11, "*", [1, 1.5]], // Item Quality
      [0, 12, "*", [1, 1.5]], // Level Quality
      [0, 24, "+", [0, 0.1]], // Bullet Crit Chance
      [0, 25, "*", [1.5, 3]], // Bullet Crit Damage
    ],
  ],
  [ // green: fuel/speed
    "Green",
    0xA0DD27,
    [
      [
        [[], [0.2, createSphere(0.20, 24)]],
        [[[0.2, -0.08, 0.15], [[0, 1, -1], 1.25]], GREEN_PRONG],
        [[[-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]], GREEN_PRONG],
      ],
      [[16, [7, 60]], [18, [60, 100]], [14, [4, 20]], [4, [10, 20]]],
      _shipSequenceStub,
      [
        [[1, [0.02, 0.05]], [2, [2.0, 3.0]], [3, [32, 90]]],
        _weaponSequenceStub,
      ],
      [4, 7],
    ],
    [
      [0, 6, "*", [1, 1.5]], // Fuel Cost
      [0, 18, "*", [1, 1.5]], // Speed
      [0, 27, "*", [1, 1.5]], // Bullet Lifetime
      [2, 3, "+", [0, 0.1]], // Damage Taken From Fuel
      [3, 21, "*", [1, 1.5]], // Spin Time
    ],
  ],
  [ // blue: tank
    "Blue",
    0x29A9D4,
    [
      [
        [[], [0.52, createSphere(0.52, 32)]],
        [[[0, -0.30, 0.42], [X_AXIS, 0.57]], [
          0.1,
          createPrism([0.09, 0.09, 0.03], 16),
        ]],
      ],
      [[16, [80, 200]], [18, [10, 25]], [14, [40, 100]], [4, [20, 40]]],
      _shipSequenceStub,
      [
        [[1, [0.02, 0.05]], [2, [1.5, 2.2]], [3, [8, 16]], [4, [15, 32]]],
        _weaponSequenceStub,
      ],
      [1, 3],
    ],
    [
      [0, 16, "*", [1, 1.5]], // Shield
      [0, 2, "*", [1, 1.5]], // Damage Taken
      [0, 14, "*", [1, 1.5]], // Mass
      [2, 0, "+", [0, 2]], // Armor
      [3, 7, "*", [1, 1.5]], // Fuel Eject Delay
    ],
  ],
  [ // pink: swarm/shotgun
    "Pink",
    0xD4349F,
    [
      [[[], [0.4, createSphere(0.10, 20)]]],
      [[16, [1, 25]], [18, [30, 75]], [14, [4, 20]], [4, [2, 8]]],
      _shipSequenceStub,
      [
        [[0, [9, 9]], [1, [0.02, 0.05]], [2, [1.2, 1.6]], [3, [8, 16]], [5, [
          0.7,
          1.5,
        ]], [6, [0.05, 0.12]]],
        _weaponSequenceStub,
      ],
      [9, 16],
    ],
    [
      [0, 10, "*", [1, 1.5]], // Item Mixture Quality
      [0, 23, "+", [0, 2]], // Bullet Count
      [0, 1, "+", [0, 0.1]], // Armor Save
      [2, 17, "*", [1, 1.5]], // Shield Regen
      [3, 8, "*", [1, 1.5]], // Fuel Regen
    ],
  ],
  [ // red: gunner
    "Red",
    0xEE3030,
    [
      [[[undefined, [Z_AXIS, -1.61]], [
        0.46,
        createPyramid([0.11, 0.09, 0.4], 3),
      ]]],
      [[16, [7, 60]], [18, [30, 75]], [14, [12, 25]], [4, [10, 20]]],
      _shipSequenceStub,
      [
        [[0, [2, 2]], [1, [0.05, 0.12]], [2, [1.5, 2.2]], [3, [16, 35]], [5, [
          0.7,
          1.5,
        ]], [6, [0.02, 0.06]]],
        _weaponSequenceStub,
      ],
      [3, 6],
    ],
    [
      [0, 26, "*", [1, 1.5]], // Bullet Damage
      [0, 28, "*", [1, 1.5]], // Bullet Rate
      [0, 5, "*", [1, 1.5]], // Fuel
      [2, 22, "*", [1, 1.5]], // Tracking Speed
      [3, 20, "*", [1, 1.5]], // Spin Handling
    ],
  ],
  [ // yellow: spread/spin
    "Yellow",
    0xF4AD32,
    [
      [
        [[0.19, -0.04, 0], [Z_AXIS, -0.3], YELLOW_ARM],
        [[-0.19, -0.04, 0], [Z_AXIS, 0.3], YELLOW_ARM],
        [[0.52, 0.02, 0], [Z_AXIS, 0.65], YELLOW_ARM],
        [[-0.52, 0.02, 0], [Z_AXIS, -0.65], YELLOW_ARM],
      ],
      [[16, [20, 120]], [18, [60, 100]], [14, [12, 25]], [4, [10, 20]]],
      _shipSequenceStub,
      [
        [[1, [0.05, 0.12]], [3, [8, 16]], [5, [1.5, 3]], [6, [0.10, 0.30]]],
        _weaponSequenceStub,
      ],
      [2, 5],
    ],
    [
      [0, 13, "*", [1, 1.5]], // Lowest Resource
      [0, 15, "+", [0, 0.1]], // Resolve
      [0, 29, "*", [1, 1.5]], // Bullet Spread
      [2, 21, "*", [1, 1.5]], // Spin Time
      [3, 19, "*", [1, 1.5]], // Spin Damage
    ],
  ],
] as ColorOptions[];
