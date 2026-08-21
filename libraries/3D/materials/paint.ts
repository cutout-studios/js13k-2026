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

import { F32 } from "~/alias";

import type { RGBA, XOMaterial } from "../types.ts";

import shaderCode from "./paint.wgsl.ts";

export const create = (
  paintData: Float32Array,
): XOMaterial => [shaderCode, paintData];

export const createPalette = (...paints: Array<number | number[]>) =>
  new F32(
    paints.flatMap((v) => v).flatMap(_parseHex),
  );

export const createWithPalette = (...paints: Array<number | number[]>) =>
  create(createPalette(...paints));

const _parseHex = (hex: number): RGBA => [
  ((hex >> 16) & 255) / 255,
  ((hex >> 8) & 255) / 255,
  (hex & 255) / 255,
  1,
];
