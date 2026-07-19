import { device, format, wgsl } from "~webgpu";

// takes a "scene" and returns webgpu pipeline (somehow)
export const pipeline = () => {
  return device.createRenderPipeline({
    layout: "auto", // TODO: ?
    vertex: {
      module: wgsl`
        @vertex
        fn main(
          @builtin(vertex_index) VertexIndex : u32
        ) -> @builtin(position) vec4f {
          var pos = array<vec2f, 3>(
            vec2(0.0, 0.5),
            vec2(-0.5, -0.5),
            vec2(0.5, -0.5)
          );

          return vec4f(pos[VertexIndex], 0.0, 1.0);
        }
      `,
    },
    fragment: {
      module: wgsl`
        @fragment
        fn main() -> @location(0) vec4f {
          return vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
      targets: [{ format }],
    },
    primitive: {
      topology: "triangle-list", // TODO: ?
    },
  });
};
