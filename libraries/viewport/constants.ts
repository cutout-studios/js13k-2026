import { copy } from "~common";
import { wgsl } from "~objects";
import { DEFAULT_RIGID_TRANSFORM } from "~transforms";
import { TRANSFORM_GROUP_ID } from "~webgpu";

import { ViewportOptions } from "./types.ts";

export const VIEWPORT_DEFAULT_OPTIONS: ViewportOptions = {
  backgroundColor: [0, 0, 0, 1],
  viewingAngle: Math.PI / 2,
  safetyCropDistance: 0.1,
  startingTransform: copy(DEFAULT_RIGID_TRANSFORM),
  missingMaterial: [
    wgsl`
    @group(${TRANSFORM_GROUP_ID})
    @binding(0)
    var<uniform> transform: mat4x4f;

    struct VertexOutput {
      @builtin(position) Position: vec4f,
    }

    @vertex
    fn main(@location(0) position: vec3f) -> VertexOutput {
      var output: VertexOutput;

      output.Position = transform * vec4f(position, 1.0); 

      return output;
    }`,
    wgsl`
    @fragment
    fn main() -> @location(0) vec4f {
      return vec4f(0.0, 1.0, 0.0, 1.0);
    }`,
    new Float32Array(),
  ],
  missingTransform: copy(
    DEFAULT_RIGID_TRANSFORM,
  ),
};
