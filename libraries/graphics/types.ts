export type WebGPUCanvas = HTMLCanvasElement & {
  getCurrentTexture(): GPUTexture;
};
