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

import { doTimes } from "~common";
import { difficultyCurve, drawEnemies, getWaveCount } from "../app/decks.ts";
import { logTable } from "./logTable.js";

import { COLOR_TYPES } from "../app/constants.ts";

const level = Number(Deno.args[0]);

const difficulty = difficultyCurve(level);
const waveCount = getWaveCount(level);

console.log({ level, waveCount, difficulty });

const DEMO_GRID_WIDTH = 30;

doTimes(waveCount, (wave) => {
  console.log({ wave });

  logTable(drawEnemies(wave, level), [
    "color",
    "count",
    "health",
    "speed",
    "mass",
    "damage",
    "drop%",
  ], {
    color: (index) => COLOR_TYPES[index],
    speed: (amount) => Math.round(DEMO_GRID_WIDTH * (amount / 100)),
    _default: (amount) => Number(amount.toFixed(1)),
  });
});
