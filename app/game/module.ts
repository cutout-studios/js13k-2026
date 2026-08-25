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

import { max, PI } from "~/alias";
import { repeat } from "~/common";
import {
  createObject,
  createPaintMaterialWithPalette as paint,
  getCollisionPairs,
  XOObject,
  Y_AXIS,
} from "~/3D";

import { DEPTH_LIMIT } from "../elements/constants.ts";

// import { GameState, PlayerEquipment } from "./options/types.ts";
import {
  PLAYER_SHIP_DISTANCE,
  PLAYER_SHIP_SHAPE,
} from "./options/constants.ts";
import { Player } from "./player/types.ts";
import { World } from "./world/types.ts";
import { getShipObjects, updateShip } from "./player/controls.ts";
import {
  createWeaponState,
  DEFAULT_WEAPON_DATA,
  deleteBullets,
  playBulletHitSound,
  playExplosionSound,
  updateBullets,
} from "./ship/weapons.ts";
import { getData } from "./ship/snapshots.ts";
import {
  deleteEnemies,
  drawEnemyGroups,
  getEnemyObjects,
} from "./world/enemies.ts";
import { getWavesInLevel } from "./world/waves.ts";

const THREE_ZEROES = () => repeat(3, 0) as [a: number, b: number, c: number];

const state: [Player, World] = [
  [ // player
    [ // ship
      [ // body
        createObject(
          [[0, 0, -PLAYER_SHIP_DISTANCE], [Y_AXIS, PI]],
          [0, PLAYER_SHIP_SHAPE],
          paint(0xFFFFFF),
        ),

        // aim
        [0, 0, -DEPTH_LIMIT],
      ],
      // weapons
      [
        createWeaponState(),
        createWeaponState(),
      ],
      // damage
      THREE_ZEROES(),
    ],

    // stats
    [
      // levels
      THREE_ZEROES(),

      // equipment
      repeat(4, undefined) as PlayerEquipment,

      // statistics (populated below)
      [],
    ],

    // inventory
    [],
  ],

  // world
  [
    drawEnemyGroups(1, 1),

    // items (floating in the world)
    [],

    // progress
    [1, 1, getWavesInLevel(1)],

    // collection
    new Set(),
  ],
];

export const updatePlayerSheet = (state: GameState): void => {
  state[0][1][2] = getData(state[0]);
};

updatePlayerSheet(state);

export default state;

export const updateGame = (
  [player, world]: GameState,
  tickLength: number,
): void => {
  updateShip(player, tickLength);
  // TODO: updateEnemies(world);

  const [[, weapons, damage], [, equipment, data], inventory] = player,
    [enemyGroups, , progress] = world;

  for (const weaponIndex in weapons) {
    const [[bulletObjects, bulletSequences]] = weapons[weaponIndex];
    const weaponData = equipment[weaponIndex] !== undefined
      ? inventory[equipment[weaponIndex]]
      : DEFAULT_WEAPON_DATA;
    updateBullets([bulletObjects, bulletSequences], tickLength);
    for (const enemyGroup of enemyGroups) {
      const [enemyObjects, , enemyData] = enemyGroup;
      const [bulletHits, enemyHits] = getCollisionPairs(
        bulletObjects,
        enemyObjects,
      );

      deleteBullets(
        [bulletObjects, bulletSequences],
        bulletHits,
      );

      const destroyedEnemies = enemyHits.reduce((destroyed, index) => {
        enemyData[index][0] -= weaponData[6]! * data[5];

        return enemyData[index][0] <= 0 ? [...destroyed, index] : destroyed;
      }, [] as number[]);

      if (bulletHits.length) {
        playBulletHitSound(0);
      }

      if (destroyedEnemies.length) {
        deleteEnemies(enemyGroup, destroyedEnemies);
        playExplosionSound(0); // TODO: pan this
      }
    }
  }

  // TODO: update each enemy bullet group, player takes damage
  damage[0] = max(0, damage[0] - data[14] * tickLength);

  // TODO: cap fuel at "segment" increments
  damage[1] = max(0, damage[1] - data[22] * tickLength);

  if (enemyGroups.every(([objectGroup]) => !objectGroup.length)) {
    progress[1]++;

    if (progress[1] > progress[2]) {
      progress[1] = 1;
      progress[0]++;
      progress[2] = getWavesInLevel(progress[0]);
      [damage[0], damage[1], damage[2]] = repeat(3, 0);
    } else {
      progress[1]++;
    }

    world[0] = drawEnemyGroups(progress[1], progress[0]);
  }
};

export const getSceneObjects = (
  [player, world]: GameState,
): XOObject[][] => [...getShipObjects(player), ...getEnemyObjects(world)];
