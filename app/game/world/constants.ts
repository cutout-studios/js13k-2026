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

import { Band, spread } from "~/common";
import { PLAYER_AIM_Z_PLANE } from "../options/module.ts";

export const DIFFICULTY_HALFLIFE = 8;

export const ENEMY_PLACEMENT_SPREAD = 5;
export const ENEMY_SPAWN_DEPTH_BAND = spread(2, PLAYER_AIM_Z_PLANE);

export const WAVE_CURVE = 7.5;
export const WAVE_PACING = [0.55, 0.8, 1, 0.7, 0.9, 1];
export const WAVES_PER_LEVEL_BAND = [2, 14] as Band;

export const GROUPS_PER_WAVE_BAND = [1, 6] as Band;

export const DROP_PITY_STEP = 0.03;
