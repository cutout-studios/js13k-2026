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

import { Band } from "~/random";
import {
  createObject,
  createPaintMaterialWithPalette as paint,
  flattenObjects,
} from "~/3D";

import GameOptions from "../options/module.ts";

export const GAME_DIFFICULTY_FALLOFF = 0.135;

export const ENEMY_Z_PLANE = 7;
export const ENEMY_SHAPES = GameOptions.slice(1).map(([, hue, [objectsArgs]]) =>
  flattenObjects(
    ...objectsArgs.map(([orientation, geometry]) =>
      createObject(orientation, geometry, paint(hue))
    ),
  )
);
export const ENEMY_PLACEMENT_SPREAD = 5;

export const WAVE_CURVE = 7.5;
export const WAVE_PACING = [0.55, 0.8, 1, 0.7, 0.9, 1];
export const WAVES_PER_LEVEL_BAND = [2, 14] as Band;

export const GROUPS_PER_WAVE_BAND = [1, 6] as Band;

export const DROP_RANK_THRESHOLDS = [0.85, 1.35] as const;
export const DROP_RANK_FALLOFF = 2;
export const DROP_RANK_UP_MIX_COUNT = 3;
