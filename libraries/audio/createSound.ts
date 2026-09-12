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
import { doTimes } from "~/common";
import { rollBand } from "~/random";

import { api } from "./api.ts";
import { masterBus } from "./masterBus.ts";
import { Sound, SoundDefinition } from "./types.ts";

export const createSound = (...definitions: SoundDefinition[]): Sound => {
  const groupBus = api.createDynamicsCompressor();

  groupBus.knee.value = 30;
  groupBus.ratio.value = 4;

  groupBus.connect(masterBus);
  const play =
    ((pan = 0, volume = 1) =>
      doTimes(definitions, ([buffer, schedule]: SoundDefinition) => {
        const source = new AudioBufferSourceNode(api, { buffer, loop: true }),
          ampKnob = api.createGain(),
          panKnob = api.createStereoPanner(),
          knobs = [ampKnob.gain, source.playbackRate, panKnob.pan];

        let time = api.currentTime;
        // exponentialRampToValueAtTime throws if the ramp starts or ends at exactly 0...
        ampKnob.gain.setValueAtTime(0.0001, time);
        panKnob.pan.setValueAtTime(pan, time);
        source.connect(ampKnob).connect(panKnob).connect(groupBus);
        source.start(time);

        doTimes(schedule, ([[knobID, value, exponential], duration = 0]) => {
          time += duration;
          const target = typeof value == "number" ? value : rollBand(value);
          knobs[knobID][
            exponential
              ? "exponentialRampToValueAtTime"
              : "linearRampToValueAtTime"
          ](
            knobID == 0
              ? max(target * volume ** 3, 0.0001)
              : knobID == 1
              ? max(target, 0.0001)
              : target,
            time,
          );
        });

        source.stop(time);
      })) as unknown as Sound;

  play.definitions = definitions;
  return play;
};
