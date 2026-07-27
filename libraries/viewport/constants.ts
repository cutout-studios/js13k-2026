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
    struct Projections {
      projection: mat4x4f,
    }

    struct VertexOutput {
      @builtin(position) Position: vec4f,
      @location(0) modelPosition: vec4f
    }

    @group(${PROJECTION_DATA_GROUP_INDEX})
    @binding(${PROJECTION_DATA_INSTANCE_INDEX})
    var<uniform> object: Projections;

    @vertex
    fn main(@location(0) position: vec3f) -> VertexOutput {
      var output: VertexOutput;

      output.Position = object.transform * vec4f(position, 1.0);
      output.modelPosition = position;

      return output;
    }`,
    wgsl`
    @fragment
    fn main(@location(0) modelPosition: vec4f) -> @location(0) vec4f {
      return 0.5 * (modelPosition + vec4f(1.0));
    }`,
  ],
  missingTransform: copy(
    DEFAULT_TRANSFORM,
  ),
};
