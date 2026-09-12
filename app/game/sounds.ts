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
  BUZZ_BUFFER,
  createSound,
  NOISE_BUFFER,
  SAWTOOTH_BUFFER,
  SINE_BUFFER,
  SQUARE_BUFFER,
  TRIANGLE_BUFFER,
} from "~/audio";
import { SoundDefinition } from "../../libraries/audio/types.ts";

export const defaultWeaponSound = createSound(
  [NOISE_BUFFER, [
    [[1, [0.7, 1]], 0],
    [[0, 0], 0.01],
    [[0, [0.01, 0.02]], 0.003],
    [[0, 0.007], 0.003],
    [[0, 0], 0.06],
  ]],
  [SINE_BUFFER, [
    [[1, [0.2, 0.6]], 0],
    [[0, 0.015], 0.006],
    [[1, [0.1, 0.16], true], 0.03],
    [[0, 0], 0.1],
  ]],
  [BUZZ_BUFFER, [
    [[1, [4.3, 6]], 0],
    [[0, 0.005], 0.03],
    [[0, 0], 0.14],
    [[1, [0.2, 0.5]], 0],
  ]],
);

export const errorSound = createSound(
  [SQUARE_BUFFER, [
    [[1, 3.5, true], 0],
    [[0, 0.06], 0],
    [[1, 1.5, true], 0.04],
    [[0, 0], 0.04],
    [[1, 1.5, true], 0],
    [[1, 3.5, true], 0],
    [[0, 0.07], 0],
    [[1, 1.5, true], 0.04],
    [[0, 0], 0.04],
  ]],
  [TRIANGLE_BUFFER, [
    [[1, 0.8, true], 0],
    [[0, 0.05], 0],
    [[1, 0.5, true], 0.04],
    [[0, 0], 0.04],
    [[1, 0.5, true], 0],
    [[1, 0.8, true], 0],
    [[0, 0.05], 0],
    [[1, 0.5, true], 0.04],
    [[0, 0], 0.04],
  ]],
);

export const equipSound = createSound(
  [NOISE_BUFFER, [
    [[1, 0.6, true], 0],
    [[0, 0.18], 0],
    [[0, 0], 0.01],
    [[0, 0], 0.02],
    [[1, 0.85, true], 0.03],
    [[0, 0.41], 0],
    [[0, 0.005], 0.01],
  ]],
  [SINE_BUFFER, [
    [[1, 0.35, true], 0],
    [[0, 0.035], 0],
    [[0, 0], 0.01],
    [[0, 0], 0.02],
    [[0, 0.035], 0.01],
    [[0, 0], 0.01],
    [[1, 0.4, true], 0.01],
  ]],
);
export const itemPickupSound = equipSound;
export const inventoryFullSound = errorSound;

export const enemyHitSound = createSound(
  [NOISE_BUFFER, [
    [[1, [0.3, 2]], 0],
    [[0, [0.02, 0.1]], 0],
    [[0, 0], 0.05],
  ]],
);

export const enemyDestroyedSound = createSound(
  [SINE_BUFFER, [
    [[1, [0.1, 0.13]], 0],
    [[0, 0.4], 0],
    [[0, 0.012], 0.06],
    [[1, 0.1], 1.5],
    [[0, 0], 1.5],
  ]],
  [SAWTOOTH_BUFFER, [
    [[1, [0.2, 0.3]], 0],
    [[0, 0.012], 0],
    [[0, 0.01], 0.14],
    [[1, [0.06, 0.02]], 0.01],
    [[0, 0, true], 1.5],
  ]],
  [NOISE_BUFFER, [
    [[1, [1.8, 2.3]], 0],
    [[0, 0.25], 0],
    [[0, 0], 0.015],
  ]],
  [NOISE_BUFFER, [
    [[1, [0.4, 0.6]], 0],
    [[0, 0.14], 0],
    [[0, 0.04], 0.2],
    [[0, 0.01], 0.6],
    [[1, [0.2, 0.3]], 0.6],
    [[0, 0, true], 1.15],
  ]],
);

export const playerSpinSound = createSound([TRIANGLE_BUFFER, [
  [[0, 0.01], 0],
  [[1, 0.8], 0],
  [[1, 2.1, true], 0.15],
  [[0, 0], 0.2],
]], [NOISE_BUFFER, [
  [[1, 0.6, true], 0],
  [[0, 0], 0],
  [[0, 0.02], 0.08],
  [[0, 0.06], 0.06],
  [[0, 0.012], 0.05],
  [[0, 0, true], 0.5],
]]);

export const rezLostSound = createSound([NOISE_BUFFER, [
  [[1, 1.25], 0],
  [[0, 0.45], 0],
  [[0, 0.05, true], 0.04],
  [[0, 0.25], 0.07],
  [[0, 0.05, true], 0.11],
  [[0, 0.14], 0.14],
  [[0, 0.03, true], 0.18],
  [[0, 0.06], 0.3],
  [[0, 0, true], 0.45],
]]);

const pistolLayer = [SAWTOOTH_BUFFER, [
  [[1, [4.3, 6]], 0],
  [[0, 0.015], 0.03],
  [[0, 0], 0.14],
  [[1, [0.2, 0.5], true], 0],
]] as SoundDefinition;

export const redWeaponSound = createSound(pistolLayer);

export const blueWeaponSound = createSound(pistolLayer, [SINE_BUFFER, [
  [[1, [0.2, 0.15]], 0],
  [[0, 0.04], 0],
  [[0, 0.4], 0.01],
  [[0, 0.11], 0.01],
  [[0, 0.08], 0.04],
]], [SQUARE_BUFFER, [
  [[1, [0.1, 0.15]], 0],
  [[0, 0], 0],
  [[0, 0.2], 0.01],
  [[0, 0.07], 0.01],
  [[0, 0], 0.09],
  [[1, 0.15], 0.05],
]]);

export const greenWeaponSound = createSound(
  [NOISE_BUFFER, [
    [[1, [1.5, 2.5], true], 0],
    [[0, 0.009], 0],
    [[0, 0.027], 0.01],
    [[0, 0.014], 0.01],
    [[0, 0.007], 0.05],
  ]],
  [BUZZ_BUFFER, [
    [[1, [3, 4], true], 0],
    [[0, 0.004], 0],
    [[0, 0.01], 0.005],
    [[0, 0.008], 0.01],
    [[0, 0], 0.15],
    [[1, [3.5, 4], true], 0.036],
  ]],
  [BUZZ_BUFFER, [
    [[0, 0.015], 0.025],
    [[1, 0.1, true], 0.025],
    [[0, 0], 0.06],
  ]],
);

export const yellowWeaponSound = createSound(
  [SINE_BUFFER, [
    [[0, 0.2], 0],
    [[1, 0.22], 0],
    [[0, 0, true], 0.38],
  ]],
  [TRIANGLE_BUFFER, [
    [[0, 0.1], 0],
    [[1, 0.2], 0],
    [[1, 0.32], 0.18],
    [[0, 0, true], 0.35],
  ]],
  [NOISE_BUFFER, [
    [[0, 0.09], 0],
    [[1, 0.25], 0],
    [[0, 0, true], 0.25],
  ]],
);
export const yellowBombReadySound = errorSound;
export const yellowBombExplodeSound = enemyDestroyedSound;

export const purpleWeaponSound = createSound(
  [SAWTOOTH_BUFFER, [
    [[1, 0.6], 0],
    [[0, 0.02], 0.08],
    [[1, 1.8], 0.08],
    [[0, 0.02], 0.5],
    [[1, 1.8], 0.5],
    [[0, 0, true], 0.65],
  ]],
  [SINE_BUFFER, [
    [[0, 0.02], 0.05],
    [[1, 0.05], 0.02],
  ]],
  [SQUARE_BUFFER, [
    [[0, 0.005], 0.08],
    [[1, 2.7], 0],
    [[0, 0.005], 0.5],
    [[0, 0, true], 0.65],
  ]],
);

export const pinkWeaponSound = greenWeaponSound;

const playerHitBase: SoundDefinition = [NOISE_BUFFER, [
  [[0, 0], 0],
  [[0, 0.15], 0.01],
  [[0, 0], 0.1],
  [[1, [2, 3]], 0.05],
]];

export const playerHitSound = createSound([TRIANGLE_BUFFER, [
  [[0, 0.075], 0],
  [[1, 1.1], 0],
  [[1, 0.5], 0.06],
  [[0, 0], 0.08],
]], [SAWTOOTH_BUFFER, [
  [[0, 0.08], 0],
  [[1, 0.85], 0],
  [[0, 0], 0.04],
]], playerHitBase);

export const playerHitCounterSound = createSound([SQUARE_BUFFER, [
  [[0, 0], 0],
  [[0, [0.004, 0.012]], 0.15],
  [[1, [5, 8]], 0],
  [[1, [7, 12]], 0.05],
]], playerHitBase);
