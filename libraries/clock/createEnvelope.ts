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

import { approachFactory } from "./approachFactory.ts";
import { createActionSequencer } from "./createActionSequencer.ts";
import { Action } from "./types.ts";

type Envelope = (tickLength: number, released?: boolean) => number;

export const createEnvelope = (
  attackTime: number,
  releaseTime: number,
): Envelope => {
  const [attackSequence, releaseSequence] = ([[
    [approachFactory(), attackTime],
  ], [[
    approachFactory(0),
    releaseTime,
  ]]] as [Action<{ value: number }>, number][][]).map(
    (schedule) => createActionSequencer(schedule),
  );

  const valueObject = { value: 0 };
  return (tickLength, released) => {
    released
      ? releaseSequence(valueObject, tickLength)
      : attackSequence(valueObject, tickLength);

    return valueObject.value;
  };
};
