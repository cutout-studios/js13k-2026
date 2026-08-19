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

/// <reference lib="dom" />

import { appendChild } from "~alias";
import { startClock } from "~clock";
import { setupDevice } from "~3D";

import { canvas, render } from "./canvas.ts";
import enemyOptions, { createEnemy } from "./enemies.ts";
import { doTimes } from "~common";
import { ship } from "./ship.ts";

// export { getBaseStats } from "./stats.ts";
// export { drawEnemies, drawItem, getWaveCount } from "./decks.ts";
// export { createAudioSource } from "~audio";

const enemies = Object.values(enemyOptions).map(createEnemy);

doTimes(
  3,
  (x) =>
    doTimes(
      2,
      (y) =>
        enemies[x * 2 + y].object.adjust([(x - 1) * 3, (y - 0.5) * 3, -10]),
    ),
);

onload = async () => {
  await setupDevice();

  appendChild(canvas);

  startClock((tickLength) => {
    ship.adjust(tickLength);
    render([
      ship.object,
      ...enemies.map((enemy) => {
        enemy.object.adjust(undefined, [[0, 1, 0], tickLength]);

        return enemy.object;
      }),
    ]);
  });
};
