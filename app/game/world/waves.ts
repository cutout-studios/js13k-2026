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

import { atan, PI, round } from "~/alias";
import { Band, range } from "~/random";

import { GAME_DIFFICULTY_FALLOFF, WAVES_PER_LEVEL_BAND } from "./constants.ts";

export const levelCurve = (
  level: number,
  falloff = GAME_DIFFICULTY_FALLOFF,
) => (2 * atan(level * falloff)) / PI;

export const levelRoll = (
  [start, end]: Band = [0, 0],
  level: number,
  falloff = GAME_DIFFICULTY_FALLOFF,
  spread = 1.125,
) => {
  const base = start + (end - start) * levelCurve(level, falloff);
  return range(base, base * spread);
};

export const getWavesInLevel = (level: number) =>
  round(levelRoll(WAVES_PER_LEVEL_BAND, level));
