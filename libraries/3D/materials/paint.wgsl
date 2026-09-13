struct O {
  @builtin(position) p: vec4f,
  @location(0) @interpolate(flat) i: u32,
}

@group(0) @binding(0)
var<storage, read> c: array<mat4x4f>;

@group(1) @binding(0)
var<storage, read> q: array<vec4f>;

@vertex
fn m(@location(0) l: vec3f, @builtin(vertex_index) v: u32, @builtin(instance_index) n: u32) -> O {
  return O(c[n] * vec4f(l, 1), v / 3u);
}

fn b(f: vec4f, i: u32) -> vec4f {
  let s = vec2f(dpdx(f.w), dpdy(f.w)) * (600 / f.w);
  let g = inverseSqrt(dot(s, s) + 1);

  // cap the rim boost
  let r = min(pow(1 - g, 2) * 0.8, 0.3);
  let a = q[i % arrayLength(&q)];

  return vec4f((a.rgb * g + r) * a.a, a.a);
}

@fragment
fn L(@builtin(position) f: vec4f, @location(0) @interpolate(flat) i: u32) -> @location(0) vec4f {
  let d = b(f, i);
  let e = pow(min(1.0, 8.0 * f.w), 3);

  return vec4f(d.rgb * e, d.a);
}

@fragment
fn F(@builtin(position) f: vec4f, @location(0) @interpolate(flat) i: u32) -> @location(0) vec4f {
  return b(f, i);
}
