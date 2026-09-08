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

import { Ship } from "../types.ts";

// - each constantly streams bullets
// - the green enemy spirals in from behind the player or from deep field,
//   constantly spewing bullets that splay outward
// - the groups enters in as a line
// - if they get out of view, they reverse their spiral
export const greenSchedule: ActionSchedule<Ship> = [[
  () => {
  },
]];
