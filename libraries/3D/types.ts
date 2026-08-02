export type XYZ = [x: number, y: number, z: number];
export type RGBA = [r: number, g: number, b: number, a: number];

export type XOGeometry = XYZ[];
export type XOMaterial = [vertex: string, fragment: string, data: Float32Array];

export type GPUDataContainer = [buffer: GPUBuffer, bindGroup: GPUBindGroup];
export type GPURenderTarget = {
  aspectRatio: number;
  descriptor: GPURenderPassDescriptor;
  render(process: (encorder: GPURenderPassEncoder) => void): void;
};
