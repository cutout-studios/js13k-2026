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

import { createSound, NOISE_BUFFER, SINE_BUFFER, SQUARE_BUFFER } from "~/audio";

export const defaultWeaponSound = createSound(
  [NOISE_BUFFER, [
    [[1, [0.7, 1]]],
    [[0, [.7, .8]], .003],
    [[0, 0], .06],
  ]],
  [SINE_BUFFER, [
    [[1, [.4, .6]]],
    [[0, .45], .004],
    [[1, [.13, .16]], .03],
    [[0, 0], .1],
  ]],
  [SQUARE_BUFFER, [
    [[1, [4.3, 6]]],
    [[0, .035], .03],
    [[0, 0], .14],
    // exp. fall-off to curtail "note" sound
    [[1, [.2, .5], true], 0],
  ]],
);

export const redWeaponSound = createSound();
export const greenWeaponSound = createSound();
export const purpleWeaponSound = createSound();
export const blueWeaponSound = createSound();
export const pinkWeaponSound = createSound();
export const yellowWeaponSound = createSound();

// TODO: wire up the yellow-specific weapon sounds
export const yellowBombReadySound = createSound();
export const yellowBombExplodeSound = createSound();

export const enemyHitSound = createSound();
export const enemyDestroyedSound = createSound();

export const playerHitSound = createSound();
export const playerSpinSound = createSound();
export const playerSpinCounterSound = createSound();

export const rezLostSound = createSound();
export const rezSavedSound = createSound();

export const itemPickupSound = createSound();
export const inventoryFullSound = createSound();

export const restoreSound = createSound();
export const winCollectionSound = createSound();
export const equipSound = createSound();

export const stageCompleteSound = createSound();
