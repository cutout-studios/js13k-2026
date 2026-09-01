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

export const bulletSound = createSound(
  [SINE_BUFFER, [
    [[1, [.17, .193]]], // 75-85Hz
    [[0, .2], .004],
    [[0, 0], .146],
  ]],
  [NOISE_BUFFER, [
    [[1, [1.82, 2.27]]], // 800-1000Hz
    [[0, 1], .01],
    [[0, .2], .05],
    [[0, 0], .09],
  ]],
);

export const hitSound = createSound(
  [SQUARE_BUFFER, [
    [[1, [3.18, 4.09]]], // 1400-1800Hz
    [[0, .05], .003],
    [[0, 0], .047],
  ]],
);

export const explosionSound = createSound(
  [TRIANGLE_BUFFER, [
    [[1, [.114, .159]], .01], // 50-70Hz, delayed
    [[0, .5], .01],
    [[0, .4], .1],
    [[0, 0], .24],
  ]],
  [NOISE_BUFFER, [
    [[1, [.409, .591]]], // 180-260Hz
    [[0, .6], .01],
    [[0, .4], .1],
    [[0, 0], .39],
  ]],
);
