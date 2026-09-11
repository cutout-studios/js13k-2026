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
  aimObject,
  createObject,
  getCollisionPairs,
  readOrigin,
  setOrigin,
} from "~/3D";
import { _, length, max, NO_OP, random } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { createActionSequencer } from "~/clock";
import { doTimes, flat, flatDoTimes, spliceTable } from "~/common";

import { visibleHalfExtentAt } from "../elements/mainCanvas.ts";
// particles: cut for now - see particles.ts
// import { createBurst, updateParticles } from "./particles.ts";
import { BASE_PROPERTIES } from "./options/module.ts";
import { PLAYER_INVENTORY_SIZE } from "./player/constants.ts";
import { createItem, setItemInFrame } from "./player/items.ts";
import { Ship, Weapon } from "./ship/types.ts";
import {
  defaultBulletSequencerFactory,
  updateBullets,
} from "./ship/weapons/bullets.ts";
import {
  enemyDestroyedSound,
  enemyHitSound,
  inventoryFullSound,
  itemPickupSound,
  playerHitSound,
  playerSpinCounterSound,
  rezLostSound,
  rezSavedSound,
  stageCompleteSound,
  winCollectionSound,
} from "./sounds.ts";
import { Game } from "./types.ts";
import { DROP_PITY_STEP } from "./world/constants.ts";
import { rollEnemies } from "./world/enemies.ts";
import { getWavesInLevel } from "./world/levels.ts";

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
    enemyShips = flat(...activeEnemyGroups) as Ship[];

  // -- update everything in the game
  doTimes(flat([playerShip], enemyShips), (ship) => {
    ship[3](ship, tickLength);
    updateBullets(ship, tickLength);
  });
  doTimes(droppedItems, (drop) => drop[1](drop, tickLength));

  // -- handle collisions
  doTimes(
    playerWeapons,
    ([, bullets, , [, critChance, critDamage, bulletDamage]]) => {
      const [hitIndicies, shipIndicies] = getCollisionPairs(
        bullets[1],
        doTimes(enemyShips, ([object]) => object),
      );

      doTimes(hitIndicies, (_, index: number) => {
        const shipIndex = shipIndicies[index],
          shipCoordinates = enemyShips[shipIndex][0][0];

        enemyHitSound(
          getPanFromCoordinates(
            shipCoordinates,
            visibleHalfExtentAt(readOrigin(shipCoordinates)[2])[0],
          ),
          readOrigin(shipCoordinates)[2] / 18,
        );
        enemyShips[shipIndex][4][0] +=
          (random() < critChance ? bulletDamage * critDamage : bulletDamage) *
          (playerSnapshot[10] * (1 + playerResourceStatus[0]));
      });

      return spliceTable(bullets, hitIndicies);
    },
  );

  if (!playerResourceStatus[3]) { // skip enemy bullets while the player is invulnerable
    doTimes(
      enemyShips,
      (
        [
          enemyShipObject,
          ,
          [[, bullets, , [, critChance, critDamage, bulletDamage]]],
        ],
      ) => {
        const [hitIndicies] = getCollisionPairs(bullets[1], [
          playerShipObject,
        ]);

        doTimes(hitIndicies, (bulletIndex: number) => {
          const baseDamage = random() < critChance
            ? bulletDamage * critDamage
            : bulletDamage;

          if (playerResourceStatus[4]) {
            playerSpinCounterSound(
              getPanFromCoordinates(playerShipObject[0]),
            );
            const bullet = bullets[0][bulletIndex],
              targetPosition = readOrigin(enemyShipObject[0]);

            aimObject(bullet[0], targetPosition);

            bullet[1] = defaultBulletSequencerFactory(bullet, 8, false);

            const fauxSnapshot = BASE_PROPERTIES.slice(18);
            fauxSnapshot[3] = baseDamage * playerSnapshot[13];

            playerWeapons.push(
              [
                createObject(),
                [[bullet], [bullet[0]]],
                createActionSequencer([[NO_OP]]),
                fauxSnapshot,
                0,
              ] as Weapon,
            );

            return;
          }

          playerHitSound(
            getPanFromCoordinates(playerShipObject[0]),
          );

          const totalDamage = baseDamage * playerSnapshot[2];

          playerResourceStatus[0] += totalDamage * (1 - playerSnapshot[3]);
          playerResourceStatus[1] += totalDamage * playerSnapshot[3];
        });

        spliceTable(bullets, hitIndicies);
      },
    );
  }

  // pick up dropped items
  const [pickedUpIndicies] = getCollisionPairs(
      droppedItems.map(([object]) => object),
      [playerShipObject],
    ),
    toPickUp = pickedUpIndicies.slice(
      0,
      PLAYER_INVENTORY_SIZE - length(inventory),
    ); // (don't pick up past the inventory cap)

  if (length(pickedUpIndicies) && !length(toPickUp)) {
    inventoryFullSound(getPanFromCoordinates(playerShipObject[0]));
  }

  doTimes(toPickUp, (itemIndex: number) => {
    setItemInFrame(droppedItems[itemIndex]);
    inventory.push(droppedItems[itemIndex]);
    if (droppedItems[itemIndex][4] == 2) {
      winCollection.add(droppedItems[itemIndex][3]);
      winCollectionSound();

      if (winCollection.size == 6) {
        alert("MISSION COMPLETED");
        location.reload();
      }
    } else itemPickupSound(getPanFromCoordinates(playerShipObject[0]));
  });

  spliceTable([droppedItems], toPickUp);

  // clean up dead enemies
  // WARNING: mutates in place, so enemyShips are stale below here
  doTimes(activeEnemyGroups, (ships) => {
    spliceTable(
      [ships],
      flatDoTimes(
        ships,
        ([[coordinates], , , , damages, snapshot, optionsIndex], index) => {
          if (damages[0] < snapshot[11]) return [];

          enemyDestroyedSound(
            getPanFromCoordinates(coordinates),
            readOrigin(coordinates)[2] / 18,
          );
          // particles: cut for now - see particles.ts
          // createBurst(
          //   readOrigin(coordinates),
          //   8,
          //   [1, 2],
          //   [0.2, 0.4],
          //   0xFFEE99FF,
          //   0x99220000,
          // );

          if (random() < snapshot[8] + world[4] * DROP_PITY_STEP) {
            world[4] = 0;
            const item = createItem(optionsIndex, _, progress[0]);
            setOrigin(item[0][0], readOrigin(coordinates));
            droppedItems.push(item);
          } else {
            world[4]++;
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
      (ships, index) => length(ships) ? [] : [index],
    ),
  );

  // clean up countered bullets
  spliceTable(
    [playerWeapons],
    flatDoTimes(
      playerWeapons,
      ([, [bullets]], index) => {
        if (index < 2) return [];

        return length(bullets) ? [] : [index];
      },
    ),
  );

  // clean up items that have floated off screen
  spliceTable(
    [droppedItems],
    flatDoTimes(
      droppedItems,
      ([[itemCoordinates]], index) =>
        readOrigin(itemCoordinates)[2] < 0 ? [] : [index],
    ),
  );

  // -- update player resources
  // restore hp
  playerResourceStatus[0] = max(
    0,
    playerResourceStatus[0] - playerSnapshot[12] * tickLength,
  );

  // if hp is depleted, reduce rez by one, trigger temporary invulnerability
  if (playerResourceStatus[0] >= playerSnapshot[11]) {
    playerResourceStatus[0] = playerSnapshot[11];
    (random() > playerSnapshot[1])
      ? (playerResourceStatus[2]++, rezLostSound())
      : rezSavedSound();
    playerResourceStatus[3] = 1;
  }

  // remove temporary invulnerability once hp is fully restored
  if (playerResourceStatus[0] <= 0) playerResourceStatus[3] = 0;

  // refill gas
  playerResourceStatus[1] = max(
    0,
    playerResourceStatus[1] - playerSnapshot[6] * tickLength,
  );

  if (length(activeEnemyGroups)) return;

  // -- update game progress
  if (progress[1] >= progress[2]) { // advance to the next level
    stageCompleteSound();
    progress[1] = 1;
    progress[0]++;
    progress[2] = getWavesInLevel(progress[0]);
    doTimes(6, (index: number) => playerResourceStatus[index] = 0);
  } else { // stay in the current level
    progress[1]++;
  }

  world[0] = rollEnemies(progress[1], progress[0]);
};
