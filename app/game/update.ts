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

import { length, max, min, random } from "~/alias";
import { doTimes, repeat, SECONDS_TO_MS, spliceTable } from "~/common";

import { rollEnemies } from "./world/enemies.ts";
import { getWavesInLevel } from "./world/levels.ts";
import { explosionSound, hitSound } from "./ship/sounds.ts";
import { createItem } from "./player/items.ts";
import GameOptions from "./options/module.ts";

import { Game } from "./types.ts";
import {
  addXYZ,
  getCollisionPairs,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
  XOObject,
  XYZ,
  XYZ_LENGTH,
} from "~/3D";
import { range } from "~/random";

const _resolveCollisions = (
  sourceObjects: XOObject[],
  targetObjects: XOObject[],
  callback: (sourceIndex: number, targetIndex: number) => void,
): number[] => {
  const sourceHits = [] as number[];
  const [sourceIndicies, targetIndicies] = getCollisionPairs(
    sourceObjects,
    targetObjects,
  );
  doTimes(sourceIndicies, (sourceIndex: number, index: number) => {
    const targetIndex = targetIndicies[index];
    callback(sourceIndex, targetIndex);
    sourceHits.push(sourceIndex);
  });
  return sourceHits;
};

const ENEMY_AIM_SPREAD = 1.5;
// TODO: "mass disruption" - target takes more damage than they have mass
export const updateGame = (
  [player, world]: Game,
  tickLength: number,
): void => {
  const [activeEnemyGroups, droppedItems, progress] = world,
    [playerShip, , inventory] = player,
    [playerShipObject, , playerWeapons, , damage, _snapshot] = playerShip,
    enemyShips = activeEnemyGroups.flatMap(([ships]) => ships),
    playerOrigin = readOrigin(playerShipObject[0]);

  // PLACEHOLDER/TODO: aim enemies at the player
  doTimes(enemyShips, (ship) => {
    const target = addXYZ(
      playerOrigin,
      doTimes(
        XYZ_LENGTH,
        () => range(-ENEMY_AIM_SPREAD, ENEMY_AIM_SPREAD),
      ) as XYZ,
    );

    ship[1] = addXYZ(
      ship[1],
      scaleXYZ(subtractXYZ(target, ship[1]), min(1, ship[5][21] * tickLength)),
    );
  });

  // -- update everything in the game
  doTimes([playerShip, ...enemyShips], (ship) => ship[3](ship, tickLength));
  doTimes(droppedItems, (drop) => drop[1](drop, tickLength));

  // -- handle collisions
  doTimes(
    playerWeapons,
    ([, , bullets, , [, critChance, critDamage, bulletDamage]]) =>
      spliceTable(
        bullets,
        _resolveCollisions(
          bullets[1],
          enemyShips.map(([object]) => object),
          (_, shipIndex) => {
            hitSound(); // TODO: pan based on location
            enemyShips[shipIndex][4][0] += random() < critChance
              ? bulletDamage * critDamage
              : bulletDamage;
          },
        ),
      ),
  );

  if (!damage[4]) { // skip enemy bullets while the player is invulnerable
    doTimes(
      enemyShips,
      ([, , [[, , bullets, , [, critChance, critDamage, bulletDamage]]]]) => {
        spliceTable(
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
      },
    );
  }

  // pick up dropped items
  spliceTable(
    [droppedItems],
    _resolveCollisions(droppedItems.map(([object]) => object), [
      playerShipObject,
    ], (itemIndex) => inventory.push([droppedItems[itemIndex]])),
  );

  // clean up dead enemies
  // TODO/WARNING: mutates in place, so enemyShips are stale below here
  doTimes(activeEnemyGroups, ([ships]) => {
    spliceTable(
      [ships],
      ships.flatMap(([[coordinates], , , , damages, snapshot], index) => {
        if (damages[0] < snapshot[15]) return [];
        explosionSound(); // TODO: pan based on location

        if (random() < snapshot[10]) {
          const item = createItem(GameOptions[1], progress[0]);
          setOrigin(item[0][0], readOrigin(coordinates));
          droppedItems.push(item);
        }

        return [index];
      }),
    );
  });

  // clean up dead enemy groups
  spliceTable(
    [activeEnemyGroups],
    activeEnemyGroups.flatMap(([ships], index) => length(ships) ? [] : [index]),
  );

  // -- update player resources
  // recharge shield
  damage[0] = max(0, damage[0] - _snapshot[16] * tickLength);

  // if shield is depleted, reduce armor by one, trigger temporary invulnerability
  if (damage[0] >= _snapshot[15]) {
    damage[0] = _snapshot[15];
    damage[3] ??= 0, damage[3]++;
    damage[4] = true;
    if (damage[3] >= _snapshot[0]) location.reload();
  }

  // remove temporary invulnerability once shields are restored
  if (damage[0] <= 0) damage[4] = false;

  // recharge fuel
  damage[1] ??= 0, damage[1] = max(0, damage[1] - _snapshot[7] * tickLength);

  // eject fuel if depleted
  if (damage[1] >= _snapshot[4] && !damage[5]) {
    damage[1] = _snapshot[4];
    damage[5] = true;
    setTimeout(() => {
      damage[2] ??= 0, damage[2]++;
      damage[1] = 0;
      damage[5] = false;
    }, _snapshot[6] * SECONDS_TO_MS);
  }

  if (length(activeEnemyGroups)) return;

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
