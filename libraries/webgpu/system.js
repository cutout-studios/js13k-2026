export const gpu = globalThis.navigator.gpu;
export const format = gpu.getPreferredCanvasFormat();

if (!gpu) {
  throw new Error("WebGPU not supported.");
}

const adapter = await gpu.requestAdapter();

if (!adapter) {
  throw new Error("Could not request adapter.");
}

export default await adapter.requestDevice();
