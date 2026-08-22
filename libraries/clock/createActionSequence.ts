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

import { Action, ActionSchedule } from "./types.ts";

export const createActionSequence = <T, K>(
  actionTimings: ActionSchedule<T, K>,
  loopCount = 1,
) => {
  let elapsedTime = 0,
    actionSwaps = 0,
    currentAction: Action<T, K>,
    currentDuration: number | undefined;

  // NOTE: We're assuming tick length is small and
  // segment durations are long: only calling the first action triggered each time.
  // For JS13K, concision > complete correctness.
  return (payload: T, tickLength: number): K | undefined => {
    if (loopCount < 1) return;

    elapsedTime += tickLength;

    if (currentDuration && elapsedTime > currentDuration) {
      elapsedTime -= currentDuration;
      actionSwaps++;
    }

    if (actionSwaps >= actionTimings.length) {
      actionSwaps = 0;
      loopCount--;
    }

    [currentAction, currentDuration = 0] = actionTimings[actionSwaps];

    return currentAction(payload, tickLength, elapsedTime, currentDuration);
  };
};
