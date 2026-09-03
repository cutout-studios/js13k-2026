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

import { Band, interpolate } from "~/common";

type Envelope = (tickLength: number, released?: boolean) => number;

export const createEnvelope = (
  attackTime: number,
  releaseTime: number,
): Envelope => {
  let band: Band = [0, 1],
    currentValue = 0,
    elapsedTime = 0,
    totalTime = attackTime,
    hasReleased = false;

  return (tickLength, released) => {
    elapsedTime += tickLength;

    if (released && !hasReleased) {
      hasReleased = true;
      totalTime = releaseTime;
      elapsedTime = 0;
      band = [currentValue, 0];
    }

    currentValue = interpolate(band, elapsedTime / totalTime);

    return currentValue;
  };
};
