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

import { min } from "~/alias";
import { SECONDS_TO_MS as MS_TO_SECONDS } from "~/common";

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

// Timed Action Sequence
type ContinuousAction<T, K> = (
  payload: T,
  tickLength: number,
  elapsedTime: number,
  duration: number,
) => K;

export const createActionSequence = <T, K>(
  actionTimings: [action: ContinuousAction<T, K>, duration?: number][],
  loopCount = 1,
) => {
  let elapsedTime = 0,
    actionSwaps = 0,
    currentAction: ContinuousAction<T, K>,
    currentDuration: number;

  // NOTE: We're assuming tick length is small and
  // segment durations are long: only calling the first action triggered each time.
  // For JS13K, concision > complete correctness.
  return (payload: T, tickLength: number): K | undefined => {
    if (loopCount < 1) return;

    elapsedTime += tickLength;

    if (elapsedTime > currentDuration) {
      elapsedTime -= currentDuration;
      actionSwaps++;
    }

    if (actionSwaps >= actionTimings.length) {
      actionSwaps %= actionTimings.length;
      loopCount--;
    }

    [currentAction, currentDuration = 0] = actionTimings[actionSwaps];

    return currentAction(payload, tickLength, elapsedTime, currentDuration);
  };
};

// Envelope
export const createEnvelope = (attack: number, release: number) => {
  const [attackSequence, releaseSequence] = ([[
    [approachFactory(), attack],
  ], [[
    approachFactory(0),
    release,
  ]]] as [ContinuousAction<number, number>, number][][]).map(
    createActionSequence,
  );

  let value = 0;
  return (tickLength: number, released?: boolean) =>
    value = (released
      ? releaseSequence(value, tickLength)
      : attackSequence(value, tickLength)) ?? value;
};

// TODO: IDK where this lives
export const approachFactory =
  (target: number = 1): ContinuousAction<number, number> =>
  (value, tickLength, _, duration) =>
    value + (target - value) * min(1, tickLength / duration);
