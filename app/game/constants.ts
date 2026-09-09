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

// deliberately a leaf module (no imports): these used to live in
// options/module.ts, which only ever defined them, never used them - but
// world/constants.ts, every ship schedule, and others all imported them
// FROM options/module.ts, which options/module.ts transitively depends on
// (to build GameOptions' schedule factories). That's a real import cycle,
// not just a theoretical one - it broke GameOptions itself at runtime
// (came back undefined). Keeping these here, with zero dependencies,
// means nothing that needs them can ever be part of a cycle over them.

export const PLAYER_SHIP_Z_PLANE = 5;
export const PLAYER_AIM_Z_PLANE = 8;
export const PLAYER_X_BOUND = 2.8;
export const PLAYER_Y_BOUND = 2.1;
