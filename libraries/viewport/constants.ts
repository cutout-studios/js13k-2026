import { copy } from "~common";
import { DEFAULT_TRANSFORM, wgsl } from "~scenes";

import { ViewportOptions } from "./types.ts";

export const PROJECTION_DATA_GROUP_INDEX = 0;
export const PROJECTION_DATA_INSTANCE_INDEX = 0;

export const VIEWPORT_DEFAULT_OPTIONS: ViewportOptions = {
  backgroundColor: [0, 0, 0],
  depthTextureFormat: "depth24plus",
  viewingAngle: Math.PI / 2,
  safetyCropDistance: 0.1,
  startingTransform: copy(DEFAULT_TRANSFORM),
  missingMaterial: [
    wgsl`
    struct VertexOutput {
      @builtin(position) Position: vec4f,
      @location(0) modelPosition: vec3f
    }

    @group(${PROJECTION_DATA_GROUP_INDEX})
    @binding(${PROJECTION_DATA_INSTANCE_INDEX})
    var<uniform> projection: mat4x4f;

    @vertex
    fn main(@location(0) position: vec3f) -> VertexOutput {
      var output: VertexOutput;

      output.Position = projection * vec4f(position, 1.0);
      output.modelPosition = position;

      return output;
    }`,
    wgsl`
    @fragment
    fn main(@location(0) modelPosition: vec3f) -> @location(0) vec4f {
      return vec4f(0.5 * (modelPosition + vec3f(1.0)), 1.0);
    }`,
  ],
  missingTransform: copy(
    DEFAULT_TRANSFORM,
  ),
};
