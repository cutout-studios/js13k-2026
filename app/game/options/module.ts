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
import { createPrism, createPyramid, createSphere, X_AXIS, Z_AXIS } from "~/3D";
import { _, NO_OP } from "~/alias";
import { ShipSnapshot, WeaponSnapshot } from "../ship/types.ts";
import { ColorOptions } from "./types.ts";

export const BULLET_SPEED = 3;

export const PLAYER_Z_PLANE = 5;
export const ENEMY_Z_PLANE = 8;
export const FIELD_X_BOUND = 2.8;
export const FIELD_Y_BOUND = 2.1;

export const BASE_PROPERTIES: [...ShipSnapshot, ...WeaponSnapshot] = [
  2, // Rez

  // 1-5
  0, // Rez Save
  1, // Damage Taken
  0, // Damage Taken From Gas
  15, // Gas
  0.30, // Gas Cost

  // 6-10
  0, // Gas Eject Delay
  5, // Gas Regen
  2, // Gas Segments
  1, // Item Mixture Quality
  0.05, // Item Drop Rate

  // 11-15
  1.2, // Level Quality
  1, // Lowest Resource
  4, // Mass
  1, // Resolve
  40, // HP

  // 16-20
  3, // Regen
  1, // Spin Damage
  0.1, // Spin Handling (?)
  0.35, // Spin Time
  2.4, // Strafe Speed

  // 21
  1.7, // Aim Time

  // WPN 0   (22)
  1, // Bullet Count

  // WPN 1-5 (23-27)
  0.05, // Bullet Crit Chance
  2, // Bullet Crit Damage
  1, // Bullet Damage
  1, // Bullet Lifetime
  8, // Bullet Rate

  // WPN 6   (28)
  0, // Bullet Spread
];

const GREEN_PRONG = [
    0.12,
    createPyramid([0.065, 0.065, 0.095], 12),
  ],
  YELLOW_ARM = [0.32, createPrism([0.2, 0.012, 0.15])];

export default [
  [ // player
    "WHITE",
    0xFFFFFF,
    [
      [[[[0.2, 0, -0.22], [[0, 1, 0], 1.9]], [
        0.3,
        createPyramid([0.1, 0.02, 0.2], 4),
      ]], [[[-0.2, 0, -0.22], [[0, 1, 0], -1.9]], [
        0.3,
        createPyramid([0.1, 0.02, 0.2], 4),
      ]], [[_, [Z_AXIS, -1.57]], [
        0.44,
        createPyramid([0.05, 0.15, 0.27], 6),
      ]], [[[0, 0, -0.28], _], [
        0.17,
        createPrism([0.03, 0.03, 0.04], 8),
      ]]],
      [],
      [[NO_OP]],
      [[[], _, [0.34, 0, -0.26]], [[], _, [-0.34, 0, -0.26]]],
      [1, 1],
    ],
    [
      [[1, 1], 0, 1, [8, 8], [1, 1]],
      [],
    ],
  ],
  [ // purple: crit/glass
    "PURPLE",
    0x8434D4,
    [
      [[[], [0.5, createPyramid([0.25, 0.25, 0.125])]]], // shape
      [[10, [0.06, 0.1]], [13, [0, 0]], [15, [6, 70]], [20, [0, 0]]], // base overrides
      _,
      [[
        [[1, [0.15, 0.35]], [2, [2.5, 5.0]], [3, [4, 80]], [5, [0.2, 0.3]]], // wpn overrides
      ]],
      [3, 5],
    ],
    [
      [[1, 3], 0, 1, [0.2, 0.8], [10, 100]],
      [
        [0, 10, "+", [0.02, 0.2]], // Item Drop rate
        [0, 11, "x", [1.05, 2.5]], // Level Quality
        [0, 23, "+", [0.005, 0.2]], // Bullet Crit Chance
        [0, 24, "x", [1.1, 5]], // Bullet Crit Damage
      ],
    ],
  ],
  [ // green: gas/speed
    "GREEN",
    0xA0DD27,
    [
      [
        [
          [[], [0.2, createSphere(0.20, 24)]],
          [[[0.2, -0.08, 0.15], [[0, 1, -1], 1.25]], GREEN_PRONG],
          [[[-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]], GREEN_PRONG],
        ],
        [[13, [7, 20]], [15, [4, 20]], [20, [3, 5]]],
        _,
        [[
          [[3, [1, 5]], [5, [12, 21]], [6, [0.5, 4]]],
          _,
          _,
          [[0.03, createSphere(0.03)]],
        ]],
        [4, 7],
      ],
      [
        [[2, 5], 0, 1, [12, 21], [1, 7]],
        [
          [0, 5, "x", [0.95, 0.2]], // Gas Cost
          [0, 20, "x", [1.05, 2.3]], // Speed
          [0, 26, "x", [1.1, 4]], // Bullet Lifetime
          [2, 3, "+", [0.02, 0.3]], // Damage Taken From Gas
          [3, 19, "+", [0.03, 0.2]], // Spin Time
        ],
      ],
    ],
  ],
  [ // blue: tank
    "BLUE",
    0x29A9D4,
    [
      [
        [[], [0.52, createSphere(0.52, 32)]],
        [[[0, -0.30, 0.42], [X_AXIS, 0.57]], [
          0.1,
          createPrism([0.09, 0.09, 0.03], 16),
        ]],
      ],
      [[10, [0.15, 0.23]], [13, [18, 200]], [15, [24, 270]], [20, [0.3, 0.6]]],
      _,
      [[
        [[3, [7, 27]], [5, [.7, 1.2]]],
      ]],
      [1, 3],
    ],
    [
      [[8, 30], 1, 1, [0.7, 1.2], [3, 8]],
      [
        [0, 15, "x", [1.1, 2.5]], // Shield
        [0, 2, "x", [0.98, 0.7]], // Damage Taken
        [0, 13, "x", [1.1, 2]], // Mass
        [2, 0, "+", [1, 4]], // Armor
        [3, 7, "+", [0.15, 0.5]], // Fuel Eject Delay
      ],
    ],
  ],
  [ // pink: swarm/shotgun
    "PINK",
    0xD4349F,
    [
      [[[], [0.4, createSphere(0.10, 20)]]],
      [[10, [0.03, 0.05]], [13, [1, 5]], [15, [1, 12]]],
      _,
      [[
        [[3, [1, 8]], [5, [0.7, 1.5]], [6, [0.05, 0.12]]],
        _,
        _,
        [[0.03, createSphere(0.03)]],
      ]],
      [9, 16],
    ],
    [
      [[0.5, 2], 0, 9, [0.3, 0.9], [1, 4]],
      [
        [0, 9, "x", [1.1, 2.2]], // Item Mixture Quality
        [0, 22, "+", [1, 3]], // Bullet Count
        [0, 1, "+", [0.05, 0.3]], // Armor Save
        [2, 16, "x", [1.1, 2]], // Shield Regen
        [3, 7, "x", [1.2, 2.2]], // Fuel Regen
      ],
    ],
  ],
  [ // red: gunner
    "RED",
    0xEE3030,
    [
      [[[_, [Z_AXIS, -1.61]], [
        0.46,
        createPyramid([0.11, 0.09, 0.4], 3),
      ]]],
      [[10, [0.05, 0.08]], [13, [6, 28]], [15, [3, 108]], [20, [2.4, 3.5]]],
      _,
      [[
        [[0, [2, 2]], [3, [3, 18]], [5, [2, 3.5]], [6, [0.02, 0.06]]],
      ]],
      [3, 6],
    ],
    [
      [[2, 4], 0, 2, [2, 4, 5], [3, 12]],
      [
        [0, 25, "x", [1.25, 3.5]], // Bullet Damage
        [0, 27, "x", [1.2, 3]], // Bullet Rate
        [0, 4, "+", [3, 15]], // Gas
        [2, 21, "+", [-0.02, -1]], // Aim Time
        [3, 18, "x", [1.1, 2.5]], // Spin Handling - TODO
      ],
    ],
  ],
  [ // yellow: spread/spin
    "YELLOW",
    0xF4AD32,
    [
      [
        [[[0.19, -0.04, 0], [Z_AXIS, -0.3]], YELLOW_ARM],
        [[[-0.19, -0.04, 0], [Z_AXIS, 0.3]], YELLOW_ARM],
        [[[0.52, 0.02, 0], [Z_AXIS, 0.65]], YELLOW_ARM],
        [[[-0.52, 0.02, 0], [Z_AXIS, -0.65]], YELLOW_ARM],
      ],
      [[10, [0.07, 0.12]], [13, [7, 13]], [15, [8, 87]], [20, [1.5, 3]]],
      _,
      [[
        [[3, [5, 16]], [5, [0.3, 0.6]], [6, [0.10, 0.30]]],
        _,
        _,
        [[0.1, createSphere(0.1)]],
      ]],
      [2, 4],
    ],
    [
      [[3, 7], 0, 1, [0.4, 1], [7, 23]],
      [
        [0, 12, "x", [1.1, 6]], // Lowest Resource
        [0, 14, "+", [0.07, 0.22]], // Resolve
        [0, 28, "x", [1, 1.5]], // Bullet Spread
        [2, 19, "x", [1.05, 1.25]], // Spin Time
        [3, 17, "x", [1.5, 5]], // Spin Damage
      ],
    ],
  ],
] as ColorOptions[];
