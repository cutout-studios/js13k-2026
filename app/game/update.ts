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

import { random } from "~/alias";
import { repeat, SECONDS_TO_MS } from "~/common";

import { rollEnemies } from "./world/enemies.ts";
import { getWavesInLevel } from "./world/levels.ts";
import { explosionSound, hitSound } from "./ship/sounds.ts";

import { Game } from "./types.ts";
import { getCollisionPairs, XOObject } from "~/3D";

const _spliceColumns = (
  structure: unknown[][],
  targetIndicies: number[],
) => {
  for (const index of targetIndicies.sort((a, b) => b - a)) {
    for (const column of structure) {
      column.splice(index, 1);
    }
  }
};

const _resolveCollisions = (
  sourceObjects: XOObject[],
  targetObjects: XOObject[],
  callback: (sourceIndex: number, targetIndex: number) => void,
): number[] => {
  const sourceHits = [];

  for (
    const [sourceIndex, targetIndex] of getCollisionPairs(
      sourceObjects,
      targetObjects,
    )
  ) {
    callback(sourceIndex, targetIndex);
    sourceHits.push(sourceIndex);
  }

  return sourceHits;
};

// TODO: "mass disruption" - target takes more damage than they have mass
// TODO: fuel costs
export const updateGame = (
  [player, world]: Game,
  tickLength: number,
): void => {
  const [activeEnemyGroups, droppedItems, progress] = world,
    [playerShip, , inventory] = player,
    [playerShipObject, , playerWeapons, , damage, _snapshot] = playerShip,
    enemyShips = activeEnemyGroups.flatMap(([ships]) => ships),
    enemyShipObjects = enemyShips.map(([object]) => object);

  // -- update everything in the game
  for (const ship of [playerShip, ...enemyShips]) ship[3](ship, tickLength);
  for (const drop of droppedItems) drop[1](drop, tickLength);

  // -- handle collisions
  for (
    const [, , bullets, , [, critChance, critDamage, bulletDamage]]
      of playerWeapons
  ) {
    _spliceColumns(
      bullets,
      _resolveCollisions(
        bullets[1],
        enemyShipObjects,
        (_, shipIndex) => {
          hitSound(), // TODO: pan based on location
            enemyShips[shipIndex][4][0] += random() < critChance
              ? bulletDamage * critDamage
              : bulletDamage;
        },
      ),
    );
  }

  if (!damage[4]) { // skip enemy bullets while the player is invulnerable
    for (
      const [, , bullets, , [, critChance, critDamage, bulletDamage]]
        of enemyShips.flatMap(([, , weapons]) => weapons)
    ) {
      _spliceColumns(
        bullets,
        _resolveCollisions(
          bullets[1],
          [playerShipObject],
          () =>
            playerShip[4][0] += random() < critChance
              ? bulletDamage * critDamage
              : bulletDamage,
        ),
      );
    }
  }

  // pick up dropped items
  _spliceColumns(
    droppedItems,
    _resolveCollisions(droppedItems.map(([object]) => object), [
      playerShipObject,
    ], (itemIndex) => inventory.push([droppedItems[itemIndex][2]])),
  );

  // clean up dead enemies
  for (const [ships] of activeEnemyGroups) {
    _spliceColumns(
      ships,
      ships.flatMap(([, , , , damages, snapshot], index) => {
        if (damages[0] < snapshot[15]) return [];

        explosionSound(); // TODO: pan based on location
        // TODO: roll item drop

        return [index];
      }),
    );
  }

  // clean up dead enemy groups
  _spliceColumns(
    activeEnemyGroups,
    activeEnemyGroups.flatMap(([, ships], index) =>
      ships.length ? [] : [index]
    ),
  );

  // -- update player resources

  // recharge shield
  damage[0] -= _snapshot[16] * tickLength;

  // if shield is depleted, reduce armor by one, trigger temporary invulnerability
  if (damage[0] >= _snapshot[15]) {
    damage[3] ??= 0, damage[3]++;
    damage[4] = true;

    // TODO: don't actually crash the game when armor is zero 🥀
    if (damage[3] >= _snapshot[0]) throw new Error("YOU DIED");
  }

  // remove temporary invulnerability once shields are restored
  if (damage[0] <= 0) damage[4] = false;

  // recharge fuel
  damage[1] ??= 0, damage[1] -= _snapshot[7] * tickLength;

  // eject fuel if depleted
  if (damage[1] >= _snapshot[4]) {
    setTimeout(() => {
      damage[2] ??= 0, damage[2]++;
    }, _snapshot[6] * SECONDS_TO_MS);
  }

  if (activeEnemyGroups.length) return;

  // -- update game progress
  if (progress[1] > progress[2]) { // advance to the next level
    progress[1] = 1;
    progress[0]++;
    progress[2] = getWavesInLevel(progress[0]);
    [damage[0], damage[1], damage[2]] = repeat(3, 0);
  } else { // stay in the current level
    progress[1]++;
  }

  world[0] = rollEnemies(progress[1], progress[0]);
};
