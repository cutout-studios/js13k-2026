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

export const SHIP_BASE_PROPERTIES: ShipSnapshot = [
  2, // Armor
  0, // Armor Save
  1, // Damage Taken
  0, // Damage Taken From Fuel
  20, // Fuel
  0.1, // Fuel Cost
  0, // Fuel Eject Delay
  7, // Fuel Regen
  2, // Fuel Segments
  1, // Item Mixture Quality
  1, // Item Drop Rate
  1.2, // Level Quality
  0, // Lowest Resource
  4, // Mass
  1, // Resolve
  40, // Shield
  5, // Shield Regen
  1, // Spin Damage
  0.1, // Spin Handling
  0.35, // Spin Time
  2.4, // Strafe Speed
  1.7, // Aim Time
];

export const WEAPON_BASE_PROPERTIES: WeaponSnapshot = [
  1, // Bullet Count
  0.05, // Bullet Crit Chance
  1, // Bullet Crit Damage
  1, // Bullet Damage
  1, // Bullet Lifetime
  8, // Bullet Rate
  0, // Bullet Spread
];

export const BULLET_SPEED = 3;

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
      [[1, 1], 1, 1, [1, 1], [1, 1]], // PLACEHOLDER
      [],
    ],
  ],
  [ // purple: crit/glass
    "PURPLE",
    0x8434D4,
    [
      [[[], [0.5, createPyramid([0.25, 0.25, 0.125])]]],
      [[16, [7, 60]], [18, [0, 0]], [14, [4, 20]], [4, [18, 25]]],
      _,
      [[
        [[1, [0.10, 0.25]], [2, [2.0, 3.0]], [3, [5, 80]], [5, [1.5, 3]]],
      ]],
      [3, 5],
    ],
    [
      [[1, 1], 1, 1, [1, 1], [1, 1]], // PLACEHOLDER
      [
        [0, 11, "x", [1, 1.5]], // Item Quality
        [0, 12, "x", [1, 1.5]], // Level Quality
        [0, 24, "+", [0, 0.1]], // Bullet Crit Chance
        [0, 25, "x", [1.5, 3]], // Bullet Crit Damage
      ],
    ],
  ],
  [ // green: fuel/speed
    "GREEN",
    0xA0DD27,
    [
      [
        [[], [0.2, createSphere(0.20, 24)]],
        [[[0.2, -0.08, 0.15], [[0, 1, -1], 1.25]], GREEN_PRONG],
        [[[-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]], GREEN_PRONG],
      ],
      [[16, [5, 40]], [18, [60, 100]], [14, [4, 20]], [4, [10, 20]]],
      _,
      [[
        [[1, [0.02, 0.05]], [2, [2.0, 3.0]], [3, [1, 5]]],
      ]],
      [4, 7],
    ],
    [
      [[1, 1], 1, 1, [1, 1], [1, 1]], // PLACEHOLDER
      [
        [0, 6, "x", [1, 1.5]], // Fuel Cost
        [0, 18, "x", [1, 1.5]], // Speed
        [0, 27, "x", [1, 1.5]], // Bullet Lifetime
        [2, 3, "+", [0, 0.1]], // Damage Taken From Fuel
        [3, 21, "x", [1, 1.5]], // Spin Time
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
      [[16, [80, 200]], [18, [10, 25]], [14, [40, 100]], [4, [20, 40]]],
      _,
      [[
        [[1, [0.02, 0.05]], [2, [1.5, 2.2]], [3, [4, 16]], [4, [15, 32]], [5, [
          .8,
          1.5,
        ]]],
      ]],
      [1, 3],
    ],
    [
      [[1, 1], 1, 1, [1, 1], [1, 1]], // PLACEHOLDER
      [
        [0, 16, "x", [1, 1.5]], // Shield
        [0, 2, "x", [1, 1.5]], // Damage Taken
        [0, 14, "x", [1, 1.5]], // Mass
        [2, 0, "+", [0, 2]], // Armor
        [3, 7, "x", [1, 1.5]], // Fuel Eject Delay
      ],
    ],
  ],
  [ // pink: swarm/shotgun
    "PINK",
    0xD4349F,
    [
      [[[], [0.4, createSphere(0.10, 20)]]],
      [[16, [1, 25]], [18, [30, 75]], [14, [4, 20]], [4, [2, 8]]],
      _,
      [[
        [[0, [9, 9]], [1, [0.02, 0.05]], [2, [1.2, 1.6]], [3, [2, 16]], [5, [
          0.7,
          1.5,
        ]], [6, [0.05, 0.12]]],
      ]],
      [9, 16],
    ],
    [
      [[1, 1], 1, 1, [1, 1], [1, 1]], // PLACEHOLDER
      [
        [0, 10, "x", [1, 1.5]], // Item Mixture Quality
        [0, 23, "+", [0, 2]], // Bullet Count
        [0, 1, "+", [0, 0.1]], // Armor Save
        [2, 17, "x", [1, 1.5]], // Shield Regen
        [3, 8, "x", [1, 1.5]], // Fuel Regen
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
      [[16, [7, 60]], [18, [30, 75]], [14, [12, 25]], [4, [10, 20]]],
      _,
      [[
        [[0, [2, 2]], [1, [0.05, 0.12]], [2, [1.5, 2.2]], [3, [6, 35]], [5, [
          0.7,
          1.5,
        ]], [6, [0.02, 0.06]]],
      ]],
      [3, 6],
    ],
    [
      [[1, 1], 2, 1, [1, 1], [1, 1]], // PLACEHOLDER
      [
        [0, 26, "x", [1, 1.5]], // Bullet Damage
        [0, 28, "x", [1, 1.5]], // Bullet Rate
        [0, 5, "x", [1, 1.5]], // Fuel
        [2, 22, "x", [1, 1.5]], // Tracking Speed
        [3, 20, "x", [1, 1.5]], // Spin Handling
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
      [[16, [8, 120]], [18, [60, 100]], [14, [12, 25]], [4, [10, 20]]],
      _,
      [[
        [[1, [0.05, 0.12]], [3, [5, 16]], [5, [1.5, 3]], [6, [0.10, 0.30]]],
      ]],
      [2, 5],
    ],
    [
      [[1, 1], 1, 1, [1, 1], [1, 1]], // PLACEHOLDER
      [
        [0, 13, "x", [1, 1.5]], // Lowest Resource
        [0, 15, "+", [0, 0.1]], // Resolve
        [0, 29, "x", [1, 1.5]], // Bullet Spread
        [2, 21, "x", [1, 1.5]], // Spin Time
        [3, 19, "x", [1, 1.5]], // Spin Damage
      ],
    ],
  ],
] as ColorOptions[];
