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
  addXYZ,
  aimObject,
  createObject,
  createPaintMaterialWithPalette as paint,
  createPrism,
  createSphere,
  normalizeXYZ,
  readHeading,
  readOrigin,
  setOrigin,
  Z_AXIS,
} from "~/3D";
import { _, NO_OP } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { doTimes, spread } from "~/common";
import { randomDirection } from "~/random";

import { createPullAction } from "../actions.ts";
import { Bullet } from "../ship/types.ts";
import {
  errorSound,
  yellowBombExplodeSound,
  yellowWeaponSound,
} from "../sounds.ts";

import { PLAYER_SHIP_Z_PLANE } from "./base.ts";
import {
  defaultBulletSequencerFactory,
  defaultShipSequencerFactory,
  defaultWeaponSequencerFactory,
} from "./defaults.ts";
import { ColorOptions } from "./types.ts";

const COLOR = 0xF4AD32FF,
  STD_PAINT = paint(COLOR),
  WARN_PAINT = paint(0xED8523FF),
  MIN_BOMB_DEPTH = PLAYER_SHIP_Z_PLANE + 2,
  SHIP_ARM = createPrism([0.2, 0.012, 0.15]);

export const yellowBulletSequencerFactory = (
  [[coordinates]]: Bullet,
  speed: number,
): ActionSequencer<Bullet> => {
  const pullAction = createPullAction(
      readHeading(coordinates),
      speed,
      (t: number) => 1 - t, // decelerate
      [spread(0.1), spread(0.1), [0, 0]],
    ),
    sequence = createActionSequencer([[
      (bullet: Bullet, ...args) => {
        pullAction(bullet[0], ...args);
        bullet[0][2] = STD_PAINT;
      },
      2.5 / speed,
    ], [(bullet: Bullet) => {
      errorSound(
        getPanFromCoordinates(bullet[0][0]),
        readOrigin(bullet[0][0])[2] / 14,
      );
    }], [
      (bullet: Bullet) => {
        bullet[0][2] = WARN_PAINT;
      },
      0.1,
    ], [
      (bullet: Bullet) => {
        bullet[0][2] = STD_PAINT;
      },
      0.1,
    ], [
      (bullet: Bullet) => {
        bullet[0][2] = WARN_PAINT;
      },
      0.1,
    ], [
      (bullet: Bullet) => {
        bullet[0][2] = STD_PAINT;
      },
      0.2,
    ], [
      (bullet: Bullet) => {
        yellowBombExplodeSound(
          getPanFromCoordinates(bullet[0][0]),
          readOrigin(bullet[0][0])[2] / 14,
        );

        const fragmentGeometry = createSphere(0.01),
          fragmentMaterial = paint(0xF4AD3266),
          bombHeading = readHeading(bullet[0][0]),
          bullets = doTimes(bullet[2]![2][bullet[3]!][3][3], () => {
            const bulletObject = createObject(
              [readOrigin(bullet[0][0])],
              fragmentGeometry,
              fragmentMaterial,
            );

            aimObject(
              bulletObject,
              addXYZ(
                readOrigin(bulletObject[0]),
                normalizeXYZ(addXYZ(bombHeading, randomDirection())),
              ),
            );

            const fragment: Bullet = [
              bulletObject,
              createActionSequencer([[NO_OP]]),
            ];
            fragment[1] = defaultBulletSequencerFactory()(fragment, 3, false);
            return fragment;
          }) as Bullet[];

        const fragmentBullets = bullet[2]![7];

        fragmentBullets[0].push(...bullets);
        fragmentBullets[1].push(...doTimes(bullets, ([object]) => object));
      },
    ]], 1);

  return (bullet: Bullet, ...args) => {
    const origin = readOrigin(bullet[0][0]);

    if (origin[2] > -MIN_BOMB_DEPTH) {
      setOrigin(bullet[0][0], [origin[0], origin[1], -MIN_BOMB_DEPTH]);
    }

    return sequence(bullet, ...args);
  };
};

export default [
  "YELLOW",
  COLOR,
  [
    [ // shape: [orientation, geometry, material][], 4 arms
      [[[0.19, -0.04, 0], [Z_AXIS, -0.3]], SHIP_ARM],
      [[[-0.19, -0.04, 0], [Z_AXIS, 0.3]], SHIP_ARM],
      [[[0.52, 0.02, 0], [Z_AXIS, 0.65]], SHIP_ARM],
      [[[-0.52, 0.02, 0], [Z_AXIS, -0.65]], SHIP_ARM],
    ],
    [ // overrides
      [8, [0.13, 0.18]], // Item Drop Rate
      [11, [30, 240]], // HP
      [16, [1, 2]], // Strafe Speed
    ],
    defaultShipSequencerFactory(), // sequenceFactory
    [ // weapons: [overrides, sequenceFactory, mount, bullet, sight?][]
      [ // bomb thrower - Bullet Damage is repurposed as fragment count, see
        // yellowBulletSequencerFactory below (fragments get their own
        // ship-level bullet group, see Ship's auxiliaryBullets)
        [
          [3, [40, 120]], // Bullet Damage -> fragment count
          [4, [1.5, 1.5]], // Bullet Speed
          [5, [0.3, 0.6]], // Bullet Rate
          [6, [0.10, 0.30]], // Bullet Spread
        ],
        defaultWeaponSequencerFactory,
        _, // mount: none, single centered gun
        [createSphere(0.1), yellowBulletSequencerFactory, yellowWeaponSound], // bullet
      ],
    ],
    [2, 4], // countBand
  ],
  [
    [[10, 18], 0, 1, [0.5, 1], [40, 100]], // item base: kg, baseModifiers, bulletCount, bulletRate, bulletDamage
    [
      [0, 24, "x", [1.5, 2.5]], // Bullet Spread
      [2, 4, "x", [2, 5]], // Gas
      [3, 3, "+", [0.2, 0.7]], // Damage -> Gas
      [3, 15, "+", [0.1, 0.5]], // Counter Time
    ],
  ],
] as ColorOptions;
