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

import { PI } from "~/alias";
import { repeat } from "~/common";
import {
  createObject,
  createPaintMaterialWithPalette as paint,
  XOObject,
  Y_AXIS,
} from "~/3D";

import { DEPTH_LIMIT } from "../elements/constants.ts";

import { GameState, PlayerEquipment } from "./types.ts";
import { PLAYER_SHIP_DISTANCE, PLAYER_SHIP_SHAPE } from "./constants.ts";

import { getShipObjects, updateShip } from "./player/ship.ts";
import { getSheet } from "./player/sheet.ts";
import { createWeaponState } from "./player/weapons.ts";
import { drawEnemyGroups } from "./world/enemies.ts";

const THREE_ZEROES = () => repeat(3, 0) as [a: number, b: number, c: number];

const state: GameState = [
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

    // stage
    1,

    // wave
    1,

    // distance
    0,

    // collection
    new Set(),
  ],
];

export const updatePlayerData = (state: GameState): void => {
  state[0][1][2] = getSheet(state[0]);
};

updatePlayerData(state);

export default state;

export const getScene = (
  [player]: GameState,
): XOObject[][] => getShipObjects(player);

export const updateGame = (state: GameState, tickLength: number): void =>
  updateShip(state[0], tickLength);
