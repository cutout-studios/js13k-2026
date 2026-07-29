import { MATERIALS_GROUP_ID, TRANSFORM_GROUP_ID } from "~webgpu";

import { Material, Paint } from "./types.ts";
import { wgsl } from "./wgsl.ts";

export const paint = (...paints: Array<number | number[]>): Material => [
  wgsl`
    @group(${TRANSFORM_GROUP_ID})
    @binding(0)
    var<uniform> transform: mat4x4f;

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

      output.Position = transform * vec4f(position, 1.0); 
      output.triangleIndex = vertexIndex / 3u;

      return output;
    }`,
  wgsl`
    @group(${MATERIALS_GROUP_ID})
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
  const _parseHex = (hex: number): Paint => [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
    1,
  ];

  return new Float32Array(
    paints.flatMap((v) => v).flatMap(_parseHex),
  );
}
