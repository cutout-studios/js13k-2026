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

import { api } from "./api.ts";
import { masterBus } from "./masterBus.ts";

import { Envelope, Source } from "./types.ts";

export const createSource = (
  type: OscillatorType,
  envelope: Envelope = [[0, 0], [0, 1]],
): Source => {
  return (
    frequencies,
    duration,
    delay = 0,
    pan = 0,
  ) => {
    for (const frequency of frequencies) {
      const [oscillator, ampKnob, panKnob] = [
        api.createOscillator(),
        api.createGain(),
        api.createStereoPanner(),
      ];
      oscillator.type = type;
      oscillator.connect(ampKnob).connect(panKnob).connect(masterBus);

      const startTime = api.currentTime + delay;
      oscillator.frequency.setValueAtTime(
        frequency,
        startTime,
      );
      panKnob.pan.setValueAtTime(pan, startTime);

      let elapsedTime = startTime;
      ampKnob.gain.setValueAtTime(0, elapsedTime);
      for (const [timeBreakpoint, velocityBreakpoint] of envelope) {
        elapsedTime += timeBreakpoint;
        ampKnob.gain.linearRampToValueAtTime(
          velocityBreakpoint,
          elapsedTime,
        );
      }
      ampKnob.gain.linearRampToValueAtTime(
        0,
        startTime + duration,
      );

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    }
  };
};
