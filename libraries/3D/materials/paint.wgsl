struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) triangleIndex: u32,
}

@group(0) @binding(0)
var<storage, read> coordinates: array<mat4x4f>;

@group(1) @binding(0)
var<storage, read> colorPalette: array<vec4f>;

@vertex
fn main(@location(0) localPosition: vec3f, @builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> VertexOutput {
  return VertexOutput(coordinates[instanceIndex] * vec4f(localPosition, 1), vertexIndex / 3u);
}

@fragment
fn paintedLambert(@builtin(position) fragment: vec4f, @location(0) @interpolate(flat) triangleIndex: u32) -> @location(0) vec4f {
  let slope = vec2f(dpdx(fragment.w), dpdy(fragment.w)) * (600 / fragment.w);
  let brightness = inverseSqrt(dot(slope, slope) + 1);

  return vec4f(colorPalette[triangleIndex % arrayLength(&colorPalette)].rgb * brightness, 1);
}
