###

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

import { repeat } from "~/common";

import { drawEnemyGroups } from "./world/enemies.ts";
import { getWavesInLevel } from "./world/waves.ts";

import { Game } from "./types.ts";
import { getCollisionPairs } from "~/3D";

export const updateGame = (
  [player, world]: Game,
  tickLength: number,
): void => {
  const [activeEnemies, , progress] = world, [playerShip] = player;
  const [playerShipObject, , playerWeapons, , damage] = playerShip, enemyShips = activeEnemies.flatMap(([, ships]) => ships);
  const enemyShipObjects = enemyShips.map(([object]) => object);

  // Update all ships
  for (const ship of [playerShip, ...enemyShips]) ship[3](ship, tickLength);

  // Handle collisions
  for (const [] of activeEnemies) {
    getCollisionPairs([playerShipObject], );

    // takeDamage(playerShip, damage);
  }

  for (const [, , [, bulletObjects]] of playerWeapons) {
    getCollisionPairs(bulletObjects, );

    // takeDamage(enemyShip, damage);
  }

  // Clean up
  ###

  if (activeEnemies.length) return;

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
};
