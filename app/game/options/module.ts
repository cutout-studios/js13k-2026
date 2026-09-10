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
import {
  createPrism,
  createPyramid,
  createSphere,
  X_AXIS,
  XOGeometry,
  XYZ,
  Z_AXIS,
} from "~/3D";
import { _, NO_OP } from "~/alias";
import { createActionSequencer } from "~/clock";
import { flat } from "~/common";
import {
  blueBulletSequencerFactory,
  blueSequencerFactory,
  blueWeaponSequenceFactory,
  greenBulletSequencerFactory,
  greenSequencerFactory,
  greenWeaponSequenceFactory,
  pinkBulletSequencerFactory,
  pinkSequencerFactory,
  pinkWeaponSequenceFactory,
  purpleBulletSequencerFactory,
  purpleSequencerFactory,
  purpleWeaponSequenceFactory,
  redBulletSequencerFactory,
  redSequencerFactory,
  redWeaponSequenceFactory,
  yellowBulletSequencerFactory,
  yellowSequencerFactory,
  yellowWeaponSequenceFactory,
} from "../ship/schedules/module.ts";
import { ShipSnapshot, WeaponSnapshot } from "../ship/types.ts";
import {
  blueWeaponSound,
  defaultWeaponSound,
  purpleWeaponSound,
  redWeaponSound,
  yellowWeaponSound,
} from "../sounds.ts";
import { ColorOptions } from "./types.ts";

const _geometry = (radius: number, mesh: [XYZ[], number]): XOGeometry =>
    flat([radius], mesh) as XOGeometry,
  defaultBulletGeometry = _geometry(
    0.06,
    createPrism([0.006, 0.006, 0.12], 12),
  );

export const BASE_PROPERTIES: [...ShipSnapshot, ...WeaponSnapshot] = [
  2, // Rez

  // 1-5
  0, // Rez Save
  1, // Damage Taken
  0, // Damage Taken From Gas
  40, // Gas
  0.1, // Gas Cost

  // 6-10
  8, // Gas Regen
  1, // Item Mixture Quality
  0.11, // Item Drop Rate
  4, // Mass
  1, // Resolve

  // 11-15
  40, // HP
  3, // Regen
  1, // Spin Damage
  1, // Spin Speed
  0.7, // Spin Time

  // 16-17
  2.4, // Strafe Speed
  1, // Aim Time

  // WPN 0   (18)
  1, // Bullet Count

  // WPN 1-5 (19-23)
  0.05, // Bullet Crit Chance
  2, // Bullet Crit Damage
  1, // Bullet Damage
  8, // Bullet Speed
  8, // Bullet Rate

  // WPN 6   (24)
  0, // Bullet Spread
];

const GREEN_PRONG = _geometry(0.12, createPyramid([0.065, 0.065, 0.095], 12)),
  YELLOW_ARM = _geometry(0.32, createPrism([0.2, 0.012, 0.15]));

export default [
  [ // player
    "WHITE",
    0xFFFFFFFF,
    [
      [[
        [[0.2, 0, -0.22], [[0, 1, 0], 1.9]],
        _geometry(
          0.3,
          createPyramid([0.1, 0.02, 0.2], 4),
        ),
      ], [
        [[-0.2, 0, -0.22], [[0, 1, 0], -1.9]],
        _geometry(
          0.3,
          createPyramid([0.1, 0.02, 0.2], 4),
        ),
      ], [
        [_, [Z_AXIS, -1.57]],
        _geometry(
          0.44,
          createPyramid([0.05, 0.15, 0.27], 6),
        ),
      ], [
        [[0, 0, -0.28], _],
        _geometry(
          0.17,
          createPrism([0.03, 0.03, 0.04], 8),
        ),
      ]],
      [],
      () => createActionSequencer([[NO_OP]]), // clear default sequencer
      [[[], _, [0.3, 0, -0.26], [
        defaultBulletGeometry,
        _,
        defaultWeaponSound,
      ]], [[], _, [-0.3, 0, -0.26], [
        defaultBulletGeometry,
        _,
        defaultWeaponSound,
      ]]],
      [1, 1],
    ],
    [
      [[1, 1], 0, 1, [8, 8], [1, 1]],
      [],
    ],
  ],
  [ // purple: crit/glass
    "PURPLE",
    0x8434D4FF,
    [
      [[[], _geometry(0.5, createPyramid([0.25, 0.25, 0.125]))]], // shape
      [[8, [0.06, 0.1]], [11, [6, 70]], [16, [0, 0]]], // base overrides
      purpleSequencerFactory,
      [[
        [[1, [0.15, 0.35]], [2, [2.5, 5.0]], [3, [4, 80]], [4, [2, 2]], [
          5,
          [0.2, 0.3],
        ]], // wpn overrides
        purpleWeaponSequenceFactory,
        _,
        [
          _geometry(0.06, createPrism([0.006, 0.006, 0.06], 12)),
          purpleBulletSequencerFactory,
          purpleWeaponSound,
        ],
      ]],
      [3, 5],
    ],
    [
      [[1, 3], 0, 1, [0.2, 0.8], [10, 100]],
      [
        [0, 8, "+", [0.02, 0.2]], // Item Drop rate
        [0, 19, "+", [0.005, 0.2]], // Bullet Crit Chance
        [0, 20, "x", [1.1, 5]], // Bullet Crit Damage
        [2, 17, "+", [-0.02, -1]], // Aim Time
        [0, 9, "x", [0.95, 0.5]], // KG
      ],
    ],
  ],
  [ // green: gas/speed
    "GREEN",
    0xA0DD27FF,
    [
      [
        [[], _geometry(0.2, createSphere(0.20, 24))],
        [[[0.2, -0.08, 0.15], [[0, 1, -1], 1.25]], GREEN_PRONG],
        [[[-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]], GREEN_PRONG],
      ],
      [[11, [4, 20]], [16, [1.2, 2.5]]],
      greenSequencerFactory,
      [[
        [[3, [0.07, 0.5]], [4, [2, 3]], [5, [12, 21]], [6, [0.05, 0.1]]],
        greenWeaponSequenceFactory,
        [0.2, -0.08, 0.15],
        [
          _geometry(0.02, createPyramid([0.02, 0.002, 0.015], 4)),
          greenBulletSequencerFactory,
          NO_OP,
        ],
      ], [
        [[3, [0.07, 0.5]], [4, [2, 3]], [5, [12, 21]], [6, [0.05, 0.1]]],
        greenWeaponSequenceFactory,
        [-0.2, -0.08, 0.15],
        [
          _geometry(0.02, createPyramid([0.02, 0.002, 0.015], 4)),
          greenBulletSequencerFactory,
          NO_OP,
        ],
      ]],
      [4, 7],
    ],
    [
      [[2, 5], 0, 1, [12, 21], [1, 7]],
      [
        [0, 5, "x", [0.95, 0.2]], // Gas Cost
        [0, 16, "x", [1.05, 2.3]], // Speed
        [0, 23, "x", [1.2, 3]], // Bullet Rate
        [3, 15, "+", [0.03, 0.2]], // Spin Time
      ],
    ],
  ],
  [ // blue: tank
    "BLUE",
    0x29A9D4FF,
    [
      [
        [[], _geometry(0.52, createSphere(0.52, 32))],
        [
          [[0, -0.30, 0.42], [X_AXIS, 0.57]],
          _geometry(
            0.1,
            createPrism([0.09, 0.09, 0.03], 16),
          ),
        ],
      ],
      [[8, [0.2, 0.3]], [11, [24, 270]], [16, [0.5, 0.8]]],
      blueSequencerFactory,
      [[
        [[3, [7, 27]], [4, [5.5, 5.5]], [5, [.7, 1.2]]],
        blueWeaponSequenceFactory,
        [0, -0.30, 0.42],
        [
          _geometry(
            0.06,
            createPrism([0.018, 0.018, 0.1], 12),
          ),
          blueBulletSequencerFactory,
          blueWeaponSound,
        ],
      ]],
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
  ],
  [ // pink: swarm/shotgun
    "PINK",
    0xD4349FFF,
    [
      [[[], _geometry(0.4, createSphere(0.10, 20))]],
      [[8, [0.02, 0.04]], [11, [1, 12]], [16, [0.5, 0.9]]],
      pinkSequencerFactory,
      [[
        // slow bullets (4), wide spread (6)
        [[3, [1, 8]], [4, [1, 2]], [5, [0.7, 1.5]], [6, [0.25, 0.5]]],
        pinkWeaponSequenceFactory,
        _,
        [
          _geometry(0.03, createSphere(0.03)),
          pinkBulletSequencerFactory,
          purpleWeaponSound,
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
  ],
  [ // red: gunner
    "RED",
    0xEE3030FF,
    [
      [[
        [_, [Z_AXIS, -1.61]],
        _geometry(
          0.46,
          createPyramid([0.11, 0.09, 0.4], 3),
        ),
      ]],
      [[8, [0.1, 0.15]], [11, [3, 108]], [16, [1, 2]], [17, [
        4,
        2.5,
      ]]],
      redSequencerFactory,
      [[
        [[0, [2, 2]], [3, [1, 10]], [5, [0.7, 3.5]], [6, [0.02, 0.06]]],
        redWeaponSequenceFactory,
        _,
        [
          _geometry(0.06, createPyramid([0.008, 0.008, 0.1], 4)),
          redBulletSequencerFactory,
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
        [0, 22, "x", [1.1, 4]], // Bullet Speed - TODO: add
        [3, 6, "x", [1.2, 2.2]], // Gas Refill
      ],
    ],
  ],
  [ // yellow: spread/spin
    "YELLOW",
    0xF4AD32FF,
    [
      [
        [[[0.19, -0.04, 0], [Z_AXIS, -0.3]], YELLOW_ARM],
        [[[-0.19, -0.04, 0], [Z_AXIS, 0.3]], YELLOW_ARM],
        [[[0.52, 0.02, 0], [Z_AXIS, 0.65]], YELLOW_ARM],
        [[[-0.52, 0.02, 0], [Z_AXIS, -0.65]], YELLOW_ARM],
      ],
      [[8, [0.13, 0.18]], [11, [8, 87]], [16, [1, 2]]],
      yellowSequencerFactory,
      [[
        [[3, [5, 16]], [4, [0.4, 0.4]], [5, [0.3, 0.6]], [6, [0.10, 0.30]]],
        yellowWeaponSequenceFactory,
        _,
        [
          _geometry(0.1, createSphere(0.1)),
          yellowBulletSequencerFactory,
          yellowWeaponSound,
        ],
      ], [
        [],
        createActionSequencer([[NO_OP]]),
      ]],
      [2, 4],
    ],
    [
      [[3, 7], 0, 1, [0.4, 1], [7, 23]],
      [
        [0, 10, "+", [0.07, 0.22]], // Resolve
        [0, 24, "x", [1, 1.5]], // Bullet Spread
        [2, 15, "x", [1.05, 1.25]], // Spin Time
        [3, 13, "x", [1.5, 5]], // Spin Damage
      ],
    ],
  ],
] as ColorOptions[];

// TODO: BulletSpeed? [0, 22, "x", [1.1, 4]],
