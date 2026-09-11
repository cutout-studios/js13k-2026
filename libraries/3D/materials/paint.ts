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

import { F32, max, min, round } from "~/alias";
import { doTimes, flatDoTimes } from "~/common";

import type { RGBA, XOMaterial } from "../types.ts";

import shaderCode from "./paint.wgsl.ts";

export const create = (
  paintData: Float32Array,
  entryPoint?: string,
): XOMaterial => [shaderCode, paintData, entryPoint];

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

export const createFlatWithPalette = (...paints: number[]) =>
  create(createPalette(...paints), "paintedFlat");

export const toRGB = (h: number, s: number, l: number, a = 255): number => {
  const chroma = (s / 100) * min(l / 100, 1 - l / 100),
    channel = (n: number) => {
      const k = (n + h / 30) % 12;

      return round(255 * (l / 100 - chroma * max(min(k - 3, 9 - k, 1), -1)));
    };

  return (channel(0) << 24) | (channel(8) << 16) | (channel(4) << 8) | a;
};
