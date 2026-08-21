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

import { SECONDS_TO_MS as MS_TO_SECONDS } from "~/common";

type SequenceAction = (
  payload: object,
  tickLength: number,
  elapsedTime: number,
  duration: number,
) => void;

export const startClock = (
  onLoop: (tickLength: number, totalClockTime: number) => void,
) => {
  const start = performance.now() / MS_TO_SECONDS;
  let last = start;

  let loopID: number;
  const tick = (now: number) => {
    now /= MS_TO_SECONDS;
    onLoop(now - last, now - start);
    last = now;
    loopID = requestAnimationFrame(tick);
  };

  loopID = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(loopID);
};

export const createSequence = (
  segments: [action: SequenceAction, duration: number][],
  loopCount = 1,
) => {
  let elapsedTime = 0,
    actionSwaps = 0,
    currentAction: SequenceAction,
    currentDuration: number;

  // NOTE: We're assuming tick length is small and
  // segment durations are long: only calling the first action triggered each time.
  // For JS13K, concision > complete correctness.
  return (payload: object, tickLength: number) => {
    if (loopCount < 1) return;

    elapsedTime += tickLength;

    if (elapsedTime > currentDuration) {
      elapsedTime -= currentDuration;
      actionSwaps++;
    }

    if (actionSwaps >= segments.length) {
      actionSwaps %= segments.length;
      loopCount--;
    }

    [currentAction, currentDuration] = segments[actionSwaps];

    currentAction(payload, tickLength, elapsedTime, currentDuration);
  };
};
