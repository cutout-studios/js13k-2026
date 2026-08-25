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
  normalizeXYZ,
  readOrigin,
  scaleXYZ,
  subtractXYZ,
} from "~/3D";
import { createActionSequence } from "~/clock";

import { BulletGroup, Weapon } from "./types.ts";

export const fireWeapon = ([object, heading, bullets]: Weapon) => {
  // TODO: bullet maker by color
  const bulletObject = createObject(
    [readOrigin(object[0])],
    [0, DEFAULT_BULLET_SHAPE],
    DEFAULT_BULLET_PAINT,
  );

  aimObject(bulletObject, heading);

  const direction = normalizeXYZ(subtractXYZ(heading, readOrigin(object[0])));

  bullets[0].push([
    bulletObject,
    createActionSequence([[
      (_, tickLength) =>
        adjustObject(
          bulletObject,
          [scaleXYZ(direction, tickLength * BULLET_SPEED_COEFFICIENT)],
        ) ?? tickLength,
      1,
    ]]),
  ]), bullets[1].push(bulletObject);
};

export const updateWeapon = (weapon: Weapon, tickLength: number) => {
  //   const [, sequences] = bullets;

  //   deleteBullets(
  //     bullets,
  //     sequences.reduce(
  //       (cullIndicies, sequence, index) =>
  //         sequence(undefined, tickLength)
  //           ? cullIndicies
  //           : [...cullIndicies, index],
  //       [] as number[],
  //     ),
  //   );
};

export const deleteBullets = (
  [bullets, bulletObjects]: BulletGroup,
  bulletIndicies: number[],
) => {
  for (const index of bulletIndicies.sort((a, b) => b - a)) {
    bullets.splice(index, 1), bulletObjects.splice(index, 1);
  }
};
