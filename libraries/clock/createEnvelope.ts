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

import { Action } from "./types.ts";
import { approachFactory } from "./approachFactory.ts";
import { createActionSequence } from "./createActionSequence.ts";

export const createEnvelope = (attack: number, release: number) => {
  const [attackSequence, releaseSequence] = ([[
    [approachFactory(), attack],
  ], [[
    approachFactory(0),
    release,
  ]]] as [Action<number, number>, number][][]).map(
    createActionSequence,
  );

  let value = 0;
  return (tickLength: number, released?: boolean) =>
    value = (released
      ? releaseSequence(value, tickLength)
      : attackSequence(value, tickLength)) ?? value;
};
