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

// compact, lossy encoding for SoundDefinition data: 1 printable-ASCII char per
// field (7-bit safe, so 1 char == 1 byte in the UTF-8-encoded source file).
// same trick as the portrait bitmap (see scripts/encodePortrait.ts) - a
// charCode offset by a fixed base decodes back to a quantized float.
//
// this module is the single source of truth for the format: devtools/sounds
// calls packSound() to produce a copy-pasteable fragment per sound, and
// app/game/sounds.ts calls createSoundDecoder() to read the concatenated
// fragments back at runtime. keeping both sides here (instead of duplicating
// the quantization formula like encodePortrait.ts does) means they can't
// drift out of sync.

import {
  createPulseBuffer,
  createRingBuffer,
  NOISE_BUFFER,
  SAWTOOTH_BUFFER,
  SINE_BUFFER,
  SQUARE_BUFFER,
  TRIANGLE_BUFFER,
} from "./buffer.ts";
import { SoundDefinition, SoundSchedule } from "./types.ts";

export const PACK_BUFFER_NAMES = [
  "SINE_BUFFER",
  "SQUARE_BUFFER",
  "TRIANGLE_BUFFER",
  "SAWTOOTH_BUFFER",
  "NOISE_BUFFER",
  "PULSE (custom)",
  "RING MOD (custom)",
] as const;

// order must match PACK_BUFFER_NAMES. the last two are factories - their
// packed "param" (duty cycle / ratio) is used to build the buffer at decode
// time instead of picking a fixed instance.
const BUFFER_SOURCES: (AudioBuffer | ((param: number) => AudioBuffer))[] = [
  SINE_BUFFER,
  SQUARE_BUFFER,
  TRIANGLE_BUFFER,
  SAWTOOTH_BUFFER,
  NOISE_BUFFER,
  createPulseBuffer,
  createRingBuffer,
];

const ALPHABET_SIZE = 93; // ASCII 32-126, minus '"' (34) and '\' (92)
const VALUE_MAX = 8; // covers gain (0-1), pitch multipliers, ring ratios
const DURATION_MAX = 0.2; // seconds

const packChar = (n: number) => {
  n = ((n % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
  let code = 32 + n;
  if (code >= 34) code++; // skip "
  if (code >= 92) code++; // skip \
  return String.fromCharCode(code);
};

const unpackChar = (code: number) => {
  if (code >= 93) code--;
  if (code >= 35) code--;
  return code - 32;
};

const packValue = (value: number, max = VALUE_MAX) =>
  packChar(
    Math.round(
      Math.max(0, Math.min(max, value)) / max * (ALPHABET_SIZE - 1),
    ),
  );

export type PackEvent = [
  knob: number,
  lo: number,
  hi: number,
  exponential: boolean,
  duration: number,
];

export type PackLayer = {
  bufferIndex: number; // index into PACK_BUFFER_NAMES
  param: number; // duty cycle / ratio - ignored for non-custom buffers
  events: PackEvent[];
};

// devtool side: current editor state -> copy-pasteable string fragment.
// append fragments (in the order you'll declare the matching decodeSound()
// calls) into the SOUND_DATA string in app/game/sounds.ts.
export const packSound = (layers: PackLayer[]) => {
  let out = packChar(layers.length);

  for (const layer of layers) {
    out += packChar(layer.bufferIndex * 8 + layer.events.length);
    out += packValue(layer.param);

    for (const [knob, lo, hi, exponential, duration] of layer.events) {
      out += packChar(knob * 2 + (exponential ? 1 : 0));
      out += packValue(lo);
      out += packValue(hi);
      out += packValue(duration, DURATION_MAX);
    }
  }

  return out;
};

// runtime side: a decoder bound to the full packed string. call it once per
// sound, in the same order the fragments were appended, to consume the next
// sound's worth of layers.
export const createSoundDecoder = (data: string) => {
  let cursor = 0;
  const next = () => unpackChar(data.charCodeAt(cursor++));
  const nextValue = (max = VALUE_MAX) => next() / (ALPHABET_SIZE - 1) * max;

  return (): SoundDefinition[] => {
    const layers: SoundDefinition[] = [];
    let layerCount = next();

    while (layerCount--) {
      const header = next(),
        param = nextValue(),
        source = BUFFER_SOURCES[header >> 3],
        buffer = typeof source == "function" ? source(param) : source;

      let eventCount = header & 7;
      const schedule: SoundSchedule = [];

      while (eventCount--) {
        const ke = next(),
          lo = nextValue(),
          hi = nextValue(),
          duration = nextValue(DURATION_MAX);

        schedule.push([[ke >> 1, lo == hi ? lo : [lo, hi], !!(ke & 1)], duration]);
      }

      layers.push([buffer, schedule]);
    }

    return layers;
  };
};
