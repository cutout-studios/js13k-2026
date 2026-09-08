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

import { Y_AXIS } from "~/3D";
import { ActionSchedule } from "~/clock";

import { createSwoopAction } from "../../actions.ts";
import { PLAYER_AIM_Z_PLANE } from "../../options/module.ts";
import { updateBullets } from "../bullets.ts";
import { Ship } from "../types.ts";

const ARC_DIP = 3, ARC_SPEED = 180, ARC_DURATION = 2;

const arcStep = (
  ship: Ship,
  tickLength: number,
  elapsedTime: number,
  duration: number,
) => {
  createSwoopAction(
    [0, 0, -PLAYER_AIM_Z_PLANE],
    ARC_DIP,
    ARC_SPEED,
    Y_AXIS, // dips on the vertical axis - arcs down from above, not front-to-back
  )(ship[0], tickLength, elapsedTime, duration);
  updateBullets(ship, tickLength);
};

// single-phase loop: settle into the aim plane and keep firing down at
// the player - no cycling needed, unlike yellow's swoop/spin/bomb phases
export const blueSchedule: ActionSchedule<Ship> = [
  [arcStep, ARC_DURATION],
];
