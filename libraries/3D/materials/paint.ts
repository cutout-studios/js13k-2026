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

import type { RGBA, XOMaterial } from "../types.ts";
import {
  COORDINATES_DATA_GROUP_ID,
  MATERIALS_DATA_GROUP_ID,
} from "../constants.ts";
import { F32 } from "~alias";

const PIXELS_PER_VIEW_UNIT = 600;
const MINIMUM_BRIGHTNESS = 0.4;

export const paint = (...paints: Array<number | number[]>): XOMaterial => [
  // Annoyingly, we must pre-minify
  /* wgsl */ `@group(${COORDINATES_DATA_GROUP_ID})@binding(0)var<uniform>c:mat4x4f;struct V{@builtin(position)p:vec4f,@location(0)i:u32}@vertex fn v(@location(0)P:vec3f,@builtin(vertex_index)x:u32)->V{return V(c*vec4f(P,1),x/3u);}`,

  // Lambert x paint pallet - brightness relative to cosine between polygon and viewing angle
  /* wgsl */ `@group(${MATERIALS_DATA_GROUP_ID})@binding(0)var<storage,read>p:array<vec4f>;@fragment fn f(@builtin(position)P:vec4f,@location(0)@interpolate(flat)i:u32)->@location(0)vec4f{let d=vec2f(dpdx(P.w),dpdy(P.w))*(${PIXELS_PER_VIEW_UNIT}.0/P.w);let l=${MINIMUM_BRIGHTNESS}+${
    1 - MINIMUM_BRIGHTNESS
  }*inverseSqrt(dot(d,d)+1);return vec4f(p[i%arrayLength(&p)].rgb*l,1);}`,
  _buildPaintData(...paints),
];

const _buildPaintData = (...paints: Array<number | number[]>) => {
  const _parseHex = (hex: number): RGBA => [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
    1,
  ];

  return new F32(
    paints.flatMap((v) => v).flatMap(_parseHex),
  );
};
