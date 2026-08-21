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
import { OneOrMore, repeat } from "~/common";
import {
  createPaintMaterialWithPalette as paint,
  XOObject,
  Y_AXIS,
} from "~/3D";

import { DEPTH_LIMIT } from "../elements/constants.ts";

import { GameState, PlayerEquipment } from "./types.ts";
import { PLAYER_SHIP_DISTANCE, PLAYER_SHIP_SHAPE } from "./constants.ts";

import { getShipObjects, updateShip } from "./player/ship.ts";
import { getSheet } from "./player/sheet.ts";

const THREE_ZEROES = () => repeat(3, 0) as [a: number, b: number, c: number];

const state: GameState = [
  [
    {
      body: [
        new XOObject(
          PLAYER_SHIP_SHAPE,
          [0, 0, -PLAYER_SHIP_DISTANCE],
          [Y_AXIS, PI],
          paint(0xFFFFFF),
        ),
        [0, 0, -DEPTH_LIMIT],
        0,
      ],
      damage: THREE_ZEROES(),
      weapons: [], // TODO
    },
    [THREE_ZEROES(), repeat(4, undefined) as PlayerEquipment, []],
    [],
  ],
  [...THREE_ZEROES(), new Set()],
];

export const updatePlayerData = (state: GameState): void => {
  state[0][1][2] = getSheet(state[0]);
};

updatePlayerData(state);

export default state;

export const getScene = ([player]: GameState): OneOrMore<XOObject>[] =>
  getShipObjects(player);

export const updateGame = (state: GameState, tickLength: number): void =>
  updateShip(state[0], tickLength);
