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

import { abs, PI, round, sin } from "~/alias";
import { range } from "~/random";
import { doTimes } from "~/common";

import { api } from "./api.ts";

const _renderCycle = (
  shape: (phase: number) => number,
  cycles = 32,
): AudioBuffer => {
  const length = round(api.sampleRate / 440) * cycles,
    buffer = api.createBuffer(1, length, api.sampleRate),
    data = buffer.getChannelData(0);

  doTimes(
    length,
    (index: number) => data[index] = shape((index / length * cycles) % 1),
  );

  return buffer;
};

export const SINE_BUFFER = _renderCycle((p) => sin(p * PI * 2));
export const SQUARE_BUFFER = _renderCycle((p) => p < 0.5 ? 1 : -1);
export const TRIANGLE_BUFFER = _renderCycle((p) => abs(p - 0.5) * 4 - 1);
export const NOISE_BUFFER = _renderCycle(() => range(1, -1), 400);
