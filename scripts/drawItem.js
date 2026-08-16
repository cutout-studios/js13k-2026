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
  COLOR_TYPES,
  ITEM_BULLET_TYPES,
  ITEM_TYPES,
  PLAYER_STAT_TYPES,
} from "../app/constants.ts";
import { drawItem } from "../app/decks.ts";
import { PAPER_GRID_WIDTH } from "./constants.ts";

import { logTable } from "./logTable.js";

const [level, type, chance = 100] = Deno.args.map(Number);

if (Math.random() > chance / 100) {
  console.log("No drop.");
  Deno.exit(0);
}

logTable([drawItem(type, level)], [
  "color",
  "item",
  "rank",
  "mass",
  "affixes",
  "bullet count",
  "bullet damage",
  "bullet lifetime",
  "bullet rate",
  "bullet raw cost",
  "bullet pattern",
], {
  color: (index) => COLOR_TYPES[index],
  item: (index) => ITEM_TYPES[index],
  ["bullet lifetime"]: (amount) =>
    Math.round(PAPER_GRID_WIDTH * (amount / 100)),
  ["bullet pattern"]: (index) => ITEM_BULLET_TYPES[index],
  affixes: (affixes) =>
    affixes.map(
      ([type, value, applicationType]) => {
        value = value.toFixed(1);

        switch (applicationType) {
          case 1:
            return `-${value}% ${PLAYER_STAT_TYPES[type]}`;
          case 2:
            return `+${value} ${PLAYER_STAT_TYPES[type]}`;
          case 0:
          default:
            return `+${value}% ${PLAYER_STAT_TYPES[type]}`;
        }
      },
    ),
  _default: (amount) => Math.round(amount),
});
