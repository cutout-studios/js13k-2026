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
  createPaintMaterialWithPalette as paint,
  createPrism,
  normalizeXYZ,
  scaleXYZ,
  subtractXYZ,
  XOObject,
} from "~/3D";

import { createActionSequence } from "~/clock";
import { createAudioSource } from "~/audio";

import { BulletState, PlayerState, WeaponState } from "../types.ts";

const BULLET_SPEED_COEFFICIENT = 25,
  DEFAULT_BULLET_SHAPE = createPrism([0.01, 0.01, 0.2]),
  DEFAULT_BULLET_PAINT = paint(0xFFE900),
  DEFAULT_BULLET_SOUND_BASS = createAudioSource("sine");
// TODO: only "default weapons" for now
export const createWeaponState = (): WeaponState => {
  return [
    [[], []],
    createActionSequence(
      [[(player: PlayerState) => {
        const [[[object]]] = player;

        DEFAULT_BULLET_SOUND_BASS([80], 0.15, 0, object.position[0] / 5); // TODO: derive

        return createBulletState(player);
      }], [
        () => undefined,
        0.25,
      ]],
      Infinity,
    ),
  ];
};

export const createBulletState = (
  [[[object, aim]]]: PlayerState,
): BulletState => {
  const bullet = new XOObject(
    DEFAULT_BULLET_SHAPE,
    object.position,
    undefined,
    DEFAULT_BULLET_PAINT,
  );

  bullet.aim(aim);

  const direction = normalizeXYZ(subtractXYZ(aim, object.position));
  return [
    bullet,
    createActionSequence([[
      (_, tickLength) =>
        bullet.adjust(
          scaleXYZ(direction, tickLength * BULLET_SPEED_COEFFICIENT),
        ) ?? tickLength,
      1,
    ]]),
  ];
};
