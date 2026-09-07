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
  createObject,
  createPaintMaterialWithPalette as paint,
  createSphere,
  scatterObjects,
  XOObject,
} from "~/3D";
import { _ } from "~/alias";
import { doTimes, flat, flatDoTimes, spread } from "~/common";

import {
  PLAYER_X_BOUND,
  PLAYER_Y_BOUND,
  PLAYER_Z_PLANE,
} from "./options/module.ts";
import startingPlayer from "./player/module.ts";
import { getShipObjects } from "./ship/module.ts";
import { Game } from "./types.ts";
import startingWorld from "./world/module.ts";

export default [startingPlayer, startingWorld, false] as Game;

const STAR_Z_PLANE = 300,
  starGeometry = createSphere(0.1),
  starPaint = paint(0xFFFFFF),
  backgroundStars = doTimes(
    200,
    () => createObject(_, [0.1, starGeometry], starPaint),
  );
scatterObjects(
  [
    spread(PLAYER_X_BOUND * (STAR_Z_PLANE / PLAYER_Z_PLANE)),
    spread(PLAYER_Y_BOUND * (STAR_Z_PLANE / PLAYER_Z_PLANE)),
    spread(10, -STAR_Z_PLANE),
  ],
  false,
  ...backgroundStars,
);

export const getSceneObjects = (
  [[playerShip], [activeEnemies, droppedItems]]: Game,
): XOObject[][] => {
  const [hull, ...rest] = getShipObjects(playerShip);
  return flat(
    [backgroundStars],
    playerShip[4][4] && (Date.now() / 80 | 0) % 2 ? [] : [hull],
    rest,
    flatDoTimes(
      activeEnemies,
      ([ships]) => flatDoTimes(ships, getShipObjects) as XOObject[][],
    ),
    doTimes(droppedItems, ([object]) => [object]),
  );
};
