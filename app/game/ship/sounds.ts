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
  createSound,
  NOISE_BUFFER,
  SINE_BUFFER,
  SQUARE_BUFFER,
  TRIANGLE_BUFFER,
} from "~/audio";
import { NO_OP } from "~/alias";

export const weaponSound = createSound(
  [SINE_BUFFER, [75, 85], 0.15, 0, 0.2],
  [NOISE_BUFFER, [800, 1000], 0.15, 0, 1, [
    [NO_OP, 0.01],
    [(sound) => {
      sound[0] = 0.2;
    }, 0.05],
  ]],
);

export const hitSound = createSound([
  SQUARE_BUFFER,
  [1400, 1800],
  0.05,
  0,
  0.05,
]);

export const explosionSound = createSound(
  [TRIANGLE_BUFFER, [50, 70], 0.35, 0.01, 0.5, [
    [NO_OP, 0.01],
    [(sound) => {
      sound[0] = 0.4;
    }, 0.1],
  ]],
  [NOISE_BUFFER, [180, 260], 0.5, 0, 0.6, [
    [NO_OP, 0.01],
    [(sound) => {
      sound[0] = 0.4;
    }, 0.1],
  ]],
);
