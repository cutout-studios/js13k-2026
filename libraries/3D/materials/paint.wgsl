struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) @interpolate(flat) triangleIndex: u32,
}

@group(0) @binding(0)
var<storage, read> coordinates: array<mat4x4f>;

@group(1) @binding(0)
var<storage, read> colorPalette: array<vec4f>;

@vertex
fn main(@location(0) localPosition: vec3f, @builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> VertexOutput {
  return VertexOutput(coordinates[instanceIndex] * vec4f(localPosition, 1), vertexIndex / 3u);
}

fn baseColor(fragment: vec4f, triangleIndex: u32) -> vec4f {
  let slope = vec2f(dpdx(fragment.w), dpdy(fragment.w)) * (600 / fragment.w);
  let facing = inverseSqrt(dot(slope, slope) + 1);

  // cap the rim boost
  let rim = min(pow(1 - facing, 2) * 0.8, 0.3);
  let paint = colorPalette[triangleIndex % arrayLength(&colorPalette)];

  return vec4f(paint.rgb * facing + rim, paint.a);
}

@fragment
fn paintedLambert(@builtin(position) fragment: vec4f, @location(0) @interpolate(flat) triangleIndex: u32) -> @location(0) vec4f {
  let color = baseColor(fragment, triangleIndex);
  let depthFalloff = pow(min(1.0, 8.0 * fragment.w), 3);

  return vec4f(color.rgb * depthFalloff, color.a);
}

@fragment
fn paintedFlat(@builtin(position) fragment: vec4f, @location(0) @interpolate(flat) triangleIndex: u32) -> @location(0) vec4f {
  return baseColor(fragment, triangleIndex);
}

