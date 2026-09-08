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

import { ActionSchedule } from "~/clock";

import { createRollAction, createSwoopAction } from "../../actions.ts";
import { PLAYER_AIM_Z_PLANE } from "../../options/module.ts";
import { createBomb } from "../bombs.ts";
import { updateBullets } from "../bullets.ts";
import { Ship } from "../types.ts";

const SWOOP_EDGE = 4,
  SWOOP_DIP = 1.5,
  SWOOP_SPEED = 3,
  SWOOP_DURATION = 2,
  SPIN_DURATION = 1,
  BOMB_DROP_DURATION = 0.5,
  BOMB_DAMAGE = 6,
  BOMB_DRIFT_SPEED = 1,
  BOMB_LIFETIME = 2;

// settles roughly at the aim plane, swooping to one edge at a time - `side`
// is -1/1 for left/right
const swoopStep = (side: number) =>
(
  ship: Ship,
  tickLength: number,
  elapsedTime: number,
  duration: number,
) => {
  createSwoopAction(
    [side * SWOOP_EDGE, 0, -PLAYER_AIM_Z_PLANE],
    SWOOP_DIP,
    SWOOP_SPEED,
  )(ship[0], tickLength, elapsedTime, duration);
  updateBullets(ship, tickLength);
};

const spinStep = (
  ship: Ship,
  tickLength: number,
  elapsedTime: number,
  duration: number,
) => {
  createRollAction(1)(ship[0], tickLength, elapsedTime, duration);
  updateBullets(ship, tickLength);
};

// fires exactly once per visit to this step (guarded by elapsedTime <
// tickLength, i.e. "just arrived"), then just keeps advancing bullets like
// every other step - the bomb itself lives on in the weapon's own pool
const bombDropStep = (
  ship: Ship,
  tickLength: number,
  elapsedTime: number,
) => {
  if (elapsedTime < tickLength) {
    const [, , weapons] = ship,
      bomb = createBomb(ship, 0, BOMB_DAMAGE, BOMB_DRIFT_SPEED, BOMB_LIFETIME);

    weapons[0][1][0].push(bomb);
    weapons[0][1][1].push(bomb[0]);
  }
  updateBullets(ship, tickLength);
};

export const yellowSchedule: ActionSchedule<Ship> = [
  [swoopStep(-1), SWOOP_DURATION],
  [spinStep, SPIN_DURATION],
  [swoopStep(1), SWOOP_DURATION],
  [bombDropStep, BOMB_DROP_DURATION],
];
