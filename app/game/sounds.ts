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
  createPulseBuffer,
  createSound,
  NOISE_BUFFER,
  SAWTOOTH_BUFFER,
  SINE_BUFFER,
  SQUARE_BUFFER,
  TRIANGLE_BUFFER,
} from "~/audio";

export const defaultWeaponSound = createSound(
  [NOISE_BUFFER, [
    [[1, [0.7, 1]], 0],
    [[0, [0.7, 0.8]], 0.003],
    [[0, 0], 0.06],
  ]],
  [SINE_BUFFER, [
    [[1, [0.4, 0.6]], 0],
    [[0, 0.43], 0.004],
    [[1, [0.13, 0.16]], 0.03],
    [[0, 0], 0.1],
  ]],
  [SQUARE_BUFFER, [
    [[1, [4.3, 6]], 0],
    [[0, 0.035], 0.03],
    [[0, 0], 0.14],
    [[1, [0.2, 0.5], true], 0],
  ]],
);

export const errorSound = createSound(
  [SQUARE_BUFFER, [
    [[1, 3.5, true], 0],
    [[0, 0.19], 0],
    [[1, 1.5, true], 0.04],
    [[0, 0], 0.04],
    [[1, 1.5, true], 0],
    [[1, 3.5, true], 0],
    [[0, 0.18], 0],
    [[1, 1.5, true], 0.04],
    [[0, 0], 0.04],
  ]],
  [TRIANGLE_BUFFER, [
    [[1, 0.8, true], 0],
    [[0, 0.15], 0],
    [[1, 0.5, true], 0.04],
    [[0, 0], 0.04],
    [[1, 0.5, true], 0],
    [[1, 0.8, true], 0],
    [[0, 0.15], 0],
    [[1, 0.5, true], 0.04],
    [[0, 0], 0.04],
  ]],
);

export const equipSound = createSound(
  [NOISE_BUFFER, [
    [[1, 0.6], 0],
    [[0, 1.14], 0],
    [[0, 0], 0.01],
    [[0, 0], 0.02],
    [[1, 0.85], 0.03],
    [[0, 1], 0],
    [[0, 0.01], 0.01],
  ]],
  [SINE_BUFFER, [
    [[1, 0.35, true], 0],
    [[0, 0.3], 0],
    [[0, 0], 0.01],
    [[0, 0], 0.02],
    [[0, 0.3], 0.01],
    [[0, 0], 0.01],
    [[1, 0.4, true], 0.01],
  ]],
);
export const itemPickupSound = equipSound;
export const inventoryFullSound = errorSound;

export const enemyHitSound = createSound(
  [NOISE_BUFFER, [
    [[1, [0.3, 0.4], true], 0],
    [[0, [0.65, 0.75]], 0],
    [[0, 0], 0.03],
  ]],
  [SAWTOOTH_BUFFER, [
    [[1, [0.7, 0.8], true], 0],
    [[0, 0.25], 0],
    [[0, 0], 0.03],
    [[1, [0.2, 0.4], true], 0.01],
  ]],
);
export const enemyDestroyedSound = createSound(
  [SINE_BUFFER, [
    [[1, [0.1, 0.13], true], 0],
    [[0, 0.5, true], 0],
    [[0, 0.1, true], 0.06],
    [[1, 0.1], 1.5],
    [[0, 0, true], 1.5],
  ]],
  [SAWTOOTH_BUFFER, [
    [[1, [0.2, 0.3], true], 0],
    [[0, 0.04], 0],
    [[0, 0.02], 0.14],
    [[1, [0.06, 0.02], true], 0.01],
    [[0, 0.01], 0.56],
    [[0, 0], 1.5],
  ]],
  [NOISE_BUFFER, [
    [[1, 1, true], 0],
    [[0, 1], 0],
    [[0, 0], 0.02],
  ]],
  [NOISE_BUFFER, [
    [[0, [0.15, 0.11], true], 0],
    [[0, 0.03, true], 0.2],
    [[0, 0.01, true], 0.6],
    [[0, 0], 1.15],
  ]],
);

// WIP
export const playerSpinSound = createSound([TRIANGLE_BUFFER, [
    [[0, 0.13], 0],
    [[1, 0.8], 0],
    [[1, 2.1, true], 0.15],
    [[0, 0], 0.2],
  ]],
  [NOISE_BUFFER, [
    [[1, 0.6, true], 0],
    [[0, 0], 0],
    [[0, 0.18], 0.08],
    [[0, 0.5], 0.06],
    [[0, 0.1], 0.05],
    [[0, 0, true], 0.5],
  ]]);

export const playerSpinCounterSound = createSound([SQUARE_BUFFER, [
  [[0, [0.5, 0.7]], 0],
  [[1, [3.6, 4.6]], 0],
  [[1, [1.0, 1.4], true], 0.08],
  [[0, 0, false], 0.08],
]], [NOISE_BUFFER, [
  [[0, [0.3, 0.5]], 0],
  [[1, [1.6, 2.4]], 0],
  [[0, 0, false], 0.03],
]]);

export const playerHitSound = createSound([TRIANGLE_BUFFER, [
  [[0, 0.65], 0],
  [[1, 1.1], 0],
  [[1, 0.5, true], 0.06],
  [[0, 0, false], 0.08],
]], [createPulseBuffer(.5), [
  [[0, 0.3], 0],
  [[1, 0.85], 0],
  [[0, 0, false], 0.04],
]]);

export const rezLostSound = createSound([NOISE_BUFFER, [
  [[1, 1.25], 0],

  [[0, 0.75], 0],
  [[0, 0.05, true], 0.04],

  [[0, 0.5], 0.07],
  [[0, 0.05, true], 0.11],

  [[0, 0.28], 0.14],
  [[0, 0.03, true], 0.18],

  [[0, 0.12], 0.21],
  [[0, 0, true], 0.26],
]]);

export const rezSavedSound = createSound([SINE_BUFFER, [
  [[0, 0.5], 0],
  [[1, 0.8], 0],
  [[1, 1.5, false], 0.07],
  [[0, 0.05, true], 0.08],

  [[0, 0.6], 0.11],
  [[1, 1.2], 0.11],
  [[1, 2.1, false], 0.21],
  [[0, 0, true], 0.25],
]]);
export const restoreSound = rezSavedSound;

export const stageCompleteSound = createSound([SINE_BUFFER, [
  [[0, 0.45], 0],
  [[1, 1.2], 0],
  [[0, 0.1], 0.08],

  [[0, 0.45], 0.09],
  [[1, 0.9], 0.09],
  [[0, 0.1], 0.17],

  [[0, 0.55], 0.18],
  [[1, 1.6], 0.18],
  [[0, 0, true], 0.45],
]], [SINE_BUFFER, [
  [[0, 0.35], 0],
  [[1, 1.8], 0],
  [[0, 0.1], 0.08],

  [[0, 0.35], 0.09],
  [[1, 1.125], 0.09],
  [[0, 0.1], 0.17],

  [[0, 0.45], 0.18],
  [[1, 3.2], 0.18],
  [[0, 0, true], 0.45],
]]);
export const winCollectionSound = stageCompleteSound;

// TODO: enemies
export const redWeaponSound = defaultWeaponSound;
export const greenWeaponSound = defaultWeaponSound;
export const purpleWeaponSound = defaultWeaponSound;
export const blueWeaponSound = defaultWeaponSound;
export const pinkWeaponSound = defaultWeaponSound;
export const yellowWeaponSound = defaultWeaponSound;
export const yellowBombReadySound = errorSound;
export const yellowBombExplodeSound = enemyDestroyedSound;
