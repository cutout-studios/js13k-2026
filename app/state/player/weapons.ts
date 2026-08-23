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
  adjustObject,
  aimObject,
  createObject,
  createPaintMaterialWithPalette as paint,
  createPrism,
  normalizeXYZ,
  readOrigin,
  scaleXYZ,
  subtractXYZ,
  XOObject,
} from "~/3D";

import { range } from "~/random";

import { createActionSequence } from "~/clock";
import { createAudioSource, NOISE_BUFFER } from "~/audio";

import {
  BulletSequence,
  BulletState,
  PlayerState,
  WeaponState,
} from "../types.ts";

const BULLET_SPEED_COEFFICIENT = 25,
  DEFAULT_BULLET_SHAPE = createPrism([0.01, 0.01, 0.2]),
  DEFAULT_BULLET_PAINT = paint(0xFFE900),
  DEFAULT_BULLET_SOUND_BASS = createAudioSource("sine"),
  DEFAULT_BULLET_SOUND_BANG = createAudioSource(NOISE_BUFFER, [
    [() => 1, 0.01],
    [() => 0.2, 0.05],
  ]);

// TODO: only "default weapons" for now
export const createWeaponState = (): WeaponState => {
  return [
    [[], []],
    createActionSequence(
      [[(player: PlayerState) => {
        const [[[[coordinates]]]] = player;

        // TODO: "group" audio sources
        DEFAULT_BULLET_SOUND_BASS(
          [range(75, 85)],
          0.15,
          0,
          readOrigin(coordinates)[0] / 5,
          0.2,
        );
        DEFAULT_BULLET_SOUND_BANG(
          [range(800, 1000)],
          0.15,
          0,
          readOrigin(coordinates)[0] / 5,
        ); // TODO: derive window sides & clamp

        return createBullet(player);
      }], [
        () => undefined,
        0.1,
      ]],
      Infinity,
    ),
  ];
};

export const createBullet = (
  [[[object, aim]]]: PlayerState,
): [XOObject, BulletSequence] => {
  const bullet = createObject(
    [readOrigin(object[0])],
    [0, DEFAULT_BULLET_SHAPE],
    DEFAULT_BULLET_PAINT,
  );

  aimObject(bullet, aim);

  const direction = normalizeXYZ(subtractXYZ(aim, readOrigin(object[0])));
  return [
    bullet,
    createActionSequence([[
      (_, tickLength) =>
        adjustObject(
          bullet,
          [scaleXYZ(direction, tickLength * BULLET_SPEED_COEFFICIENT)],
        ) ?? tickLength,
      1,
    ]]),
  ];
};

export const updateBullets = (
  bullets: BulletState,
  tickLength: number,
): void => {
  const [, sequences] = bullets;

  deleteBullets(
    bullets,
    sequences.reduce(
      (cullIndicies, sequence, index) =>
        sequence(undefined, tickLength)
          ? cullIndicies
          : [...cullIndicies, index],
      [] as number[],
    ),
  );
};

export const deleteBullets = (
  [bulletObjects, bulletSequences]: BulletState,
  bulletIndicies: number[],
) => {
  for (const index of bulletIndicies.sort((a, b) => b - a)) {
    bulletObjects.splice(index, 1);
    bulletSequences.splice(index, 1);
  }
};
