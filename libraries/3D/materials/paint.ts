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

import { wgsl } from "./wgsl.ts";

export const paint = (...paints: Array<number | number[]>): XOMaterial => [
  wgsl`
    @group(${COORDINATES_DATA_GROUP_ID})
    @binding(0)
    var<uniform> coordinateData: mat4x4f;

    struct VertexOutput {
      @builtin(position) Position: vec4f,
      @location(0) triangleIndex: u32
    }

    @vertex
    fn main(
      @location(0) position: vec3f,
      @builtin(vertex_index) vertexIndex: u32
    ) -> VertexOutput {
      var output: VertexOutput;

      output.Position = coordinateData * vec4f(position, 1.0); 
      output.triangleIndex = vertexIndex / 3u;

      return output;
    }`,
  wgsl`
    @group(${MATERIALS_DATA_GROUP_ID})
    @binding(0) var<storage, read>
    palette: array<vec4f>;

    @fragment
    fn main(
      @location(0) @interpolate(flat) triangleIndex: u32
    ) -> @location(0) vec4f {
      return palette[triangleIndex % arrayLength(&palette)];
    }`,
  _buildPaintData(...paints),
];

function _buildPaintData(...paints: Array<number | number[]>) {
  const _parseHex = (hex: number): RGBA => [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
    1,
  ];

  return new Float32Array(
    paints.flatMap((v) => v).flatMap(_parseHex),
  );
}
