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

import { readOrigin } from "~/3D";
import { max, min } from "~/alias";
import { doTimes } from "~/common";
import { range } from "~/random";

import { api } from "./api.ts";
import { masterBus } from "./masterBus.ts";
import { SoundDefinition } from "./types.ts";

export const createSound = (...definitions: SoundDefinition[]) => {
  const groupBus = api.createDynamicsCompressor();
  groupBus.connect(masterBus);

  return (pan = 0) =>
    doTimes(definitions, ([buffer, schedule]: SoundDefinition) => {
      const source = new AudioBufferSourceNode(api, { buffer, loop: true }),
        ampKnob = api.createGain(),
        panKnob = api.createStereoPanner(),
        knobs = [ampKnob.gain, source.playbackRate, panKnob.pan];

      let time = api.currentTime;
      ampKnob.gain.setValueAtTime(0, time);
      panKnob.pan.setValueAtTime(pan, time);
      source.connect(ampKnob).connect(panKnob).connect(groupBus);
      source.start(time);

      doTimes(schedule, ([[knobID, value], duration = 0]) => {
        time += duration;
        knobs[knobID].linearRampToValueAtTime(
          typeof value == "number" ? value : range(...value),
          time,
        );
      });

      source.stop(time);
    });
};

export const getPanFromCoordinates = (
  coordinates: Float32Array,
  yBound: number,
) => min(1, max(-1, readOrigin(coordinates)[1] / yBound));
