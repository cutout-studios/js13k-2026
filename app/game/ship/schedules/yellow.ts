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

// swoops to the right or left, then alternate between doing a spin
// counter and "dropping a bomb" between swoops to the left or right
// their "bomb" weapon floats forward similar to an item and then
// "explodes" when its lifetime expires, spawing a scatterbox of bullets (1
// for each damage the bomb deals) that go in random directions
export const yellowSchedule: ActionSchedule<Ship> = [[() => {}]];
