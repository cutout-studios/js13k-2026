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
} from "../app/constants.ts";
import { drawItem } from "../app/decks.ts";

import { logTable } from "./logTable.js";

const [level, type, chance = 100] = Deno.args.map(Number);

if (Math.random() > chance / 100) {
  console.log("No drop.");
  Deno.exit(0);
}
const DEMO_GRID_WIDTH = 30;

logTable([drawItem(type, level)], [
  "color",
  "item",
  "rank",
  "mass",
  "affixes",
  "count",
  "damage",
  "life",
  "rate",
  "cost",
  "spread",
], {
  color: (index) => COLOR_TYPES[index],
  item: (index) => ITEM_TYPES[index],
  life: (amount) => Math.round(DEMO_GRID_WIDTH * (amount / 100)),
  spread: (index) => ITEM_BULLET_TYPES[index],
  affixes: (affixes) =>
    affixes.map(
      ([name, value, type]) => {
        value = value.toFixed(1);

        switch (type) {
          case 1:
            return `-${value}% ${name}`;
          case 2:
            return `+${value} ${name}`;
          case 0:
          default:
            return `+${value}% ${name}`;
        }
      },
    ),
  _default: (amount) => Number(amount.toFixed(1)),
});
