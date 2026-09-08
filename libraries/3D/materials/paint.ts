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

import { abs, F32, max, min, round } from "~/alias";
import { doTimes, flatDoTimes } from "~/common";

import type { RGBA, XOMaterial } from "../types.ts";

import shaderCode from "./paint.wgsl.ts";

export const create = (
  paintData: Float32Array,
): XOMaterial => [shaderCode, paintData];

// unpacks a 0xRRGGBBAA hex into 4 normalized (0-1) channels
const _unpackRGBA = (hex: number): RGBA =>
  doTimes(
    4,
    (index: number) => ((hex >> (24 - 8 * index)) & 255) / 255,
  ) as RGBA;

export const createPalette = (...paints: number[]) =>
  new F32(flatDoTimes(paints, _unpackRGBA));

export const createWithPalette = (...paints: number[]) =>
  create(createPalette(...paints));

export const toRGB = (h: number, s: number, l: number, a = 255): number => {
  const chroma = (s / 100) * min(l / 100, 1 - l / 100),
    channel = (n: number) => {
      const k = (n + h / 30) % 12;

      return round(255 * (l / 100 - chroma * max(min(k - 3, 9 - k, 1), -1)));
    };

  return (channel(0) << 24) | (channel(8) << 16) | (channel(4) << 8) | a;
};

export const toHSL = (
  hex: number,
): [h: number, s: number, l: number, a: number] => {
  const [r, g, b] = _unpackRGBA(hex),
    hi = max(r, g, b),
    lo = min(r, g, b),
    l = (hi + lo) / 2,
    delta = hi - lo,
    s = delta ? delta / (1 - abs(2 * l - 1)) : 0,
    h = !delta
      ? 0
      : 60 * (hi == r
        ? ((g - b) / delta + 6) % 6
        : hi == g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4);

  return [h, s * 100, l * 100, hex & 255];
};
