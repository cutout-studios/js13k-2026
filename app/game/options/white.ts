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
import { createActionSequencer } from "~/clock";

import { defaultWeaponSound } from "../sounds.ts";
import { defaultBulletGeometry } from "./defaults.ts";

export default [
  "WHITE",
  0xFFFFFFFF,
  [
    [[
      [[0.2, 0, -0.22], [[0, 1, 0], 1.9]],
      createPyramid([0.1, 0.02, 0.2], 4),
    ], [
      [[-0.2, 0, -0.22], [[0, 1, 0], -1.9]],
      createPyramid([0.1, 0.02, 0.2], 4),
    ], [
      [_, [Z_AXIS, -1.57]],
      createPyramid([0.05, 0.15, 0.27], 6),
      ,
    ], [
      [[0, 0, -0.28], _],
      createPyramid([0.03, 0.03, 0.04], 8),
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
];
