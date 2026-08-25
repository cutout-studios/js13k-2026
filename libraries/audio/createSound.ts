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

import { max } from "~/alias";
import { range } from "~/random";

import { api } from "./api.ts";
import { masterBus } from "./masterBus.ts";
import { SoundChannels, SoundDefinition } from "./types.ts";

export const createSound = (...definitions: SoundDefinition[]) => {
  const groupBus = api.createDynamicsCompressor();
  groupBus.connect(masterBus);

  return (pan = 0) =>
    definitions.forEach(
      (
        [
          buffer,
          [lo, hi],
          duration,
          delay = 0,
          velocity = 1,
          schedule = [[() => [1]]],
        ],
      ) => {
        const startTime = api.currentTime + delay,
          source = new AudioBufferSourceNode(api, { buffer, loop: true }),
          ampKnob = api.createGain(),
          panKnob = api.createStereoPanner();

        source.connect(ampKnob).connect(panKnob).connect(groupBus);

        const knobs = [ampKnob.gain, source.playbackRate, panKnob.pan];
        let state: SoundChannels = [
          velocity,
          range(lo, hi) / 440,
          pan,
        ];

        knobs.forEach((param, i) =>
          param.setValueAtTime(i === 0 ? 0 : state[i], startTime)
        );

        let elapsedTime = startTime;
        for (const [action, timing = 0] of schedule) {
          elapsedTime += timing;
          state = action(state, timing, elapsedTime, duration) as SoundChannels;

          state.forEach((value, i) =>
            knobs[i].linearRampToValueAtTime(value, elapsedTime)
          );
        }

        ampKnob.gain.linearRampToValueAtTime(
          0,
          max(elapsedTime, startTime + duration),
        );

        source.start(startTime);
        source.stop(startTime + duration);
      },
    );
};
