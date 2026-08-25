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

import { ColorOptions } from "../options/types.ts";
import { levelRoll } from "../world/waves.ts";
import { WEAPON_STAT_BASE } from "./constants.ts";
import { Weapon, WeaponStatSnapshot } from "./types.ts";

export const createWeaponSnapshot = (
  [, , [, [, weaponOverrides]]]: ColorOptions,
  level = 1,
) => {
  const shipSnapshot = [...WEAPON_STAT_BASE] as WeaponStatSnapshot;

  for (const [statID, statBand] of weaponOverrides) {
    shipSnapshot[statID] = levelRoll(statBand, level);
  }

  return shipSnapshot;
};

export const fireWeapon = (weapon: Weapon, tickLength: number) => {
};

// ---

// import {
//   adjustObject,
//   aimObject,
//   createObject,
//   createPaintMaterialWithPalette as paint,
//   createPrism,
//   normalizeXYZ,
//   readOrigin,
//   scaleXYZ,
//   subtractXYZ,
//   XOObject,
// } from "~/3D";

// import { range } from "~/random";

// import { createActionSequence } from "~/clock";
// import { createAudioSource, NOISE_BUFFER } from "~/audio";

// import { Player } from "../player/types.ts";
// import { Bullet, BulletGroup, Weapon } from "./types.ts";

// const BULLET_SPEED_COEFFICIENT = 25,
//   DEFAULT_BULLET_SHAPE = createPrism([0.01, 0.01, 0.2]),
//   DEFAULT_BULLET_PAINT = paint(0xFFE900),
//   DEFAULT_BULLET_SOUND_BASS = createAudioSource("sine"),
//   DEFAULT_BULLET_SOUND_BANG = createAudioSource(NOISE_BUFFER, [
//     [() => 1, 0.01],
//     [() => 0.2, 0.05],
//   ]);

// const HIT_SOUND = createAudioSource("square");
// const EXPLOSION_NOISE = createAudioSource(NOISE_BUFFER, [[() => 1, 0.01], [
//   () => 0.3,
//   0.12,
// ]]);
// const EXPLOSION_BODY = createAudioSource("triangle", [[() => 1, 0.01], [
//   () => 0.4,
//   0.1,
// ]]);

// export const playBulletHitSound = (pan: number = 0) =>
//   HIT_SOUND([range(1400, 1800)], 0.05, 0, pan / 5, 0.05);
// export const playExplosionSound = (pan: number = 0) => {
//   EXPLOSION_NOISE([range(180, 260)], 0.5, 0, pan / 5, 0.6);
//   EXPLOSION_BODY([range(50, 70)], 0.35, 0.01, pan / 5, 0.5);
// };

// export const createWeaponState = (): Weapon => {
//   return [
//     [[], []],
//     createActionSequence(
//       [[(player: Player) => {
//         const [[[[coordinates]]]] = player;

//         // TODO: "group" audio sources
//         DEFAULT_BULLET_SOUND_BASS(
//           [range(75, 85)],
//           0.15,
//           0,
//           readOrigin(coordinates)[0] / 5,
//           0.2,
//         );
//         DEFAULT_BULLET_SOUND_BANG(
//           [range(800, 1000)],
//           0.15,
//           0,
//           readOrigin(coordinates)[0] / 5,
//         ); // TODO: derive window sides & clamp

//         return createBullet(player);
//       }], [
//         () => undefined,
//         DEFAULT_WEAPON_DATA[8],
//       ]],
//       Infinity,
//     ),
//   ];
// };

// export const createBullet = (
//   [[[object, aim]]]: Player,
// ): Bullet => {
//   const bullet = createObject(
//     [readOrigin(object[0])],
//     [0, DEFAULT_BULLET_SHAPE],
//     DEFAULT_BULLET_PAINT,
//   );

//   aimObject(bullet, aim);

//   const direction = normalizeXYZ(subtractXYZ(aim, readOrigin(object[0])));
//   return [
//     bullet,
//     createActionSequence([[
//       (_, tickLength) =>
//         adjustObject(
//           bullet,
//           [scaleXYZ(direction, tickLength * BULLET_SPEED_COEFFICIENT)],
//         ) ?? tickLength,
//       1,
//     ]]),
//   ];
// };

// export const updateBullets = (
//   bullets: BulletGroup,
//   tickLength: number,
// ): void => {
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
// };

// export const deleteBullets = (
//   [bulletObjects, bulletSequences]: BulletGroup,
//   bulletIndicies: number[],
// ) => {
//   for (const index of bulletIndicies.sort((a, b) => b - a)) {
//     bulletObjects.splice(index, 1);
//     bulletSequences.splice(index, 1);
//   }
// };
