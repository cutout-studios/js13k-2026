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

import { getShipObjects } from "./ship/module.ts";
import { Game } from "./types.ts";

import startingPlayer from "./player/module.ts";
import startingWorld from "./world/module.ts";
import { XOObject } from "~/3D";

export default [startingPlayer, startingWorld] as Game;

// TODO: toggle based on player invulnerability
export const getSceneObjects = (
  [[playerShip], [activeEnemies, droppedItems]]: Game,
): XOObject[][] => [
  ...getShipObjects(playerShip),
  ...activeEnemies.flatMap(([ships]) => ships.flatMap(getShipObjects)),
  ...droppedItems.map(([object]) => [object]),
];
