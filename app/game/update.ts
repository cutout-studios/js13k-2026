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
  addXYZ,
  aimObject,
  createObject,
  getCollisionPairs,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
  XOObject,
  XYZ,
  XYZ_LENGTH,
} from "~/3D";
import { _, length, max, min, NO_OP, random } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { createActionSequencer } from "~/clock";
import {
  doTimes,
  flat,
  flatDoTimes,
  repeat,
  SECONDS_TO_MS,
  spliceTable,
  spread,
} from "~/common";
import { rollBand } from "~/random";

import { createItem, setItemInFrame } from "./player/items.ts";
import { updateBullets } from "./ship/bullets.ts";
import { explosionSound, hitSound } from "./ship/sounds.ts";
import { Ship, Weapon } from "./ship/types.ts";
import { Game } from "./types.ts";
import { rollEnemies } from "./world/enemies.ts";
import { getWavesInLevel } from "./world/levels.ts";

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

export const updateGame = (
  [player, world]: Game,
  tickLength: number,
): void => {
  const [activeEnemyGroups, droppedItems, progress, winCollection] = world,
    [playerShip, , inventory] = player,
    [
      playerShipObject,
      ,
      playerWeapons,
      ,
      playerResourceStatus,
      playerSnapshot,
    ] = playerShip,
    enemyShips = flatDoTimes(activeEnemyGroups, ([ships]) => ships) as Ship[],
    playerOrigin = readOrigin(playerShipObject[0]);

  // TEMP: aim enemies at the player
  const ENEMY_AIM_SPREAD = 1.5;
  doTimes(enemyShips, (ship) => {
    const target = addXYZ(
      playerOrigin,
      doTimes(
        XYZ_LENGTH,
        () => rollBand(spread(ENEMY_AIM_SPREAD)),
      ) as XYZ,
    );

    ship[1] = addXYZ(
      ship[1],
      scaleXYZ(subtractXYZ(target, ship[1]), min(1, ship[5][21] * tickLength)),
    );
  });

  // -- update everything in the game
  doTimes(flat([playerShip], enemyShips), (ship) => ship[3](ship, tickLength));
  doTimes(droppedItems, (drop) => drop[1](drop, tickLength));

  updateBullets(playerShip, tickLength);

  // -- handle collisions
  doTimes(
    playerWeapons,
    ([, , bullets, , [, critChance, critDamage, bulletDamage]]) => {
      return spliceTable(
        bullets,
        _resolveCollisions(
          bullets[1],
          doTimes(enemyShips, ([object]) => object),
          (_, shipIndex) => {
            hitSound(getPanFromCoordinates(enemyShips[shipIndex][0][0], 2.1));
            enemyShips[shipIndex][4][0] +=
              (random() < critChance
                ? bulletDamage * critDamage
                : bulletDamage) * (playerSnapshot[14] * (1 + playerShip[4][0]));
          },
        ),
      );
    },
  );

  if (!playerResourceStatus[4]) { // skip enemy bullets while the player is invulnerable
    doTimes(
      enemyShips,
      (
        [
          enemyShipObject,
          ,
          [[, , bullets, , [, critChance, critDamage, bulletDamage]]],
        ],
      ) => {
        spliceTable(
          bullets,
          _resolveCollisions(
            bullets[1],
            [playerShipObject],
            (bulletIndex) => {
              const baseDamage = random() < critChance
                ? bulletDamage * critDamage
                : bulletDamage;

              if (playerResourceStatus[6]) {
                hitSound(getPanFromCoordinates(playerShipObject[0], 2.1));
                const bullet = bullets[0][bulletIndex],
                  newHeading = readOrigin(enemyShipObject[0]);
                bullet[1] = newHeading;
                aimObject(bullet[0], newHeading);

                const fauxSnapshot = repeat(7, 0);
                fauxSnapshot[3] = baseDamage * playerSnapshot[17];

                playerWeapons.push(
                  [
                    createObject(),
                    newHeading,
                    [[bullet], [bullet[0]]],
                    createActionSequencer([[NO_OP]]),
                    fauxSnapshot,
                  ] as Weapon,
                );

                return;
              }

              const totalDamage = baseDamage * playerSnapshot[2];

              playerShip[4][0] += totalDamage * (1 - playerSnapshot[3]);
              playerShip[4][1] += totalDamage * playerSnapshot[3];
            },
          ),
        );
      },
    );
  }

  // pick up dropped items
  spliceTable(
    [droppedItems],
    _resolveCollisions(
      droppedItems.map(([object]) => object),
      [
        playerShipObject,
      ],
      (
        itemIndex,
      ) => (setItemInFrame(droppedItems[itemIndex]),
        inventory.push([droppedItems[itemIndex]])),
    ),
  );

  // clean up dead enemies
  // WARNING: mutates in place, so enemyShips are stale below here
  doTimes(activeEnemyGroups, ([ships]) => {
    spliceTable(
      [ships],
      flatDoTimes(
        ships,
        ([[coordinates], , , , damages, snapshot, optionsIndex], index) => {
          if (damages[0] < snapshot[15]) return [];
          explosionSound(getPanFromCoordinates(coordinates, 2.1));

          if (random() < snapshot[10]) {
            const item = createItem(optionsIndex, _, progress[0]);
            setOrigin(item[0][0], readOrigin(coordinates));
            droppedItems.push(item);
          }

          return [index];
        },
      ),
    );
  });

  // clean up dead enemy groups
  spliceTable(
    [activeEnemyGroups],
    flatDoTimes(
      activeEnemyGroups,
      ([ships], index) => length(ships) ? [] : [index],
    ),
  );

  // -- update player resources
  // restore hp
  playerResourceStatus[0] = max(
    0,
    playerResourceStatus[0] - playerSnapshot[16] * tickLength,
  );

  // if hp is depleted, reduce rez by one, trigger temporary invulnerability
  if (playerResourceStatus[0] >= playerSnapshot[15]) {
    explosionSound();
    playerResourceStatus[0] = playerSnapshot[15];
    (random() > playerSnapshot[1]) && playerResourceStatus[3]++;
    playerResourceStatus[4] = 1;
    if (playerResourceStatus[3] >= playerSnapshot[0]) {
      alert("MISSION " + (winCollection.size == 6 ? "COMPLETE" : "FAILED"));
      location.reload();
    }
  }

  // remove temporary invulnerability once hp is fully restored
  if (playerResourceStatus[0] <= 0) playerResourceStatus[4] = 0;

  // refill gas
  playerResourceStatus[1] = max(
    0,
    playerResourceStatus[1] - playerSnapshot[7] * tickLength,
  );

  // eject gas when depleted
  if (
    playerResourceStatus[1] >= playerSnapshot[4] && !playerResourceStatus[5]
  ) {
    playerResourceStatus[1] = playerSnapshot[4];
    playerResourceStatus[5] = 1;
    setTimeout(() => {
      playerResourceStatus[2]++;
      playerResourceStatus[1] = playerResourceStatus[5] = 0;
    }, playerSnapshot[6] * SECONDS_TO_MS);
  }

  if (length(activeEnemyGroups)) return;

  // -- update game progress
  if (progress[1] > progress[2]) { // advance to the next level
    progress[1] = 1;
    progress[0]++;
    progress[2] = getWavesInLevel(progress[0]);
    playerResourceStatus[0] =
      playerResourceStatus[1] =
      playerResourceStatus[2] =
        0;
  } else { // stay in the current level
    progress[1]++;
  }

  world[0] = rollEnemies(progress[1], progress[0]);
};
