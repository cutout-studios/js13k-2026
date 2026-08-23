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

import { range } from "~/random";
import { doTimes } from "~/common";

import { ActionSchedule } from "../clock/types.ts";

import { api } from "./api.ts";
import { masterBus } from "./masterBus.ts";
import { Source } from "./types.ts";

export const NOISE_BUFFER = api.createBuffer(1, api.sampleRate, api.sampleRate);

NOISE_BUFFER.getChannelData(0).set(
  doTimes(api.sampleRate, () => range(-1, 1)),
);

export const createSource = (
  type: OscillatorType | AudioBuffer,
  velocitySchedule: ActionSchedule<void, number> = [[() => 1]],
): Source => {
  return (
    frequencies,
    duration,
    delay = 0,
    pan = 0,
    velocity = 1,
  ) => {
    for (const frequency of frequencies) {
      const startTime = api.currentTime + delay;

      let source;
      if (type instanceof AudioBuffer) {
        source = new AudioBufferSourceNode(api, { buffer: type, loop: true });
        source.playbackRate.setValueAtTime(
          frequency / 440,
          startTime,
        );
      } else {
        source = api.createOscillator();
        source.type = type;
        source.frequency.setValueAtTime(
          frequency,
          startTime,
        );
      }

      const ampKnob = api.createGain(), panKnob = api.createStereoPanner();

      source.connect(ampKnob).connect(panKnob).connect(masterBus);

      panKnob.pan.setValueAtTime(pan, startTime);

      let elapsedTime = startTime;
      ampKnob.gain.setValueAtTime(0, elapsedTime);
      for (const [velocityAction, timing = 0] of velocitySchedule) {
        elapsedTime += timing;
        ampKnob.gain.linearRampToValueAtTime(
          velocity * velocityAction(undefined, 0, 0, 0),
          elapsedTime,
        );
      }
      ampKnob.gain.linearRampToValueAtTime(
        0,
        startTime + duration,
      );

      source.start(startTime);
      source.stop(startTime + duration);
      // TODO: clean up source
    }
  };
};
