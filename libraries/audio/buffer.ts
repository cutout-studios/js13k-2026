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
import { doTimes } from "~/common";
import { rollSpread } from "~/random";

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
export const NOISE_BUFFER =
  ((i, L) =>
    _renderCycle(
      () => rollSpread() * Math.min(1, i / 64, (L - i++) / 64),
      400,
    ))(0, round(api.sampleRate / 440) * 400);
export const SAWTOOTH_BUFFER = _renderCycle((p) => p * 2 - 1);

export const BUZZ_BUFFER = _renderCycle((p) => {
  if (p < 0.05) return sin((p / 0.05) * PI);
  if (p > 0.5 && p < 0.55) return -sin(((p - 0.5) / 0.05) * PI);
  return 0;
});

export const createPulseBuffer = (
  dutyCycle: number,
  cycles = 32,
): AudioBuffer => _renderCycle((p) => p < dutyCycle ? 1 : -1, cycles);

export const createRingBuffer = (ratio: number, cycles = 32): AudioBuffer =>
  _renderCycle((p) => sin(p * PI * 2) * sin(p * PI * 2 * ratio), cycles);
