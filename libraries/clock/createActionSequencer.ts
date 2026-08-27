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

import { _, length } from "~/alias";
import { Action, ActionSchedule, ActionSequencer } from "./types.ts";

export const createActionSequencer = <T>(
  actionTimings: ActionSchedule<T>,
  loopCount = Infinity,
): ActionSequencer<T> => {
  let elapsedTime = 0,
    actionSwaps = 0,
    currentAction: Action<T>,
    currentDuration: number | undefined;

  // NOTE: We're assuming tick length is small and
  // segment durations are long: only calling the first action triggered each time.
  // For JS13K, concision > complete correctness.
  return (payload: T, tickLength: number): boolean => {
    if (loopCount < 1) return true;

    elapsedTime += tickLength;

    if (currentDuration !== _ && elapsedTime > currentDuration) {
      elapsedTime -= currentDuration;
      actionSwaps++;
    }

    if (actionSwaps >= length(actionTimings)) {
      actionSwaps = 0;
      loopCount--;
    }

    [currentAction, currentDuration = 0] = actionTimings[actionSwaps];

    return currentAction(payload, tickLength, elapsedTime, currentDuration) ??
      false;
  };
};
