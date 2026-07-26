export const gpu = globalThis.navigator.gpu;
export const format = gpu.getPreferredCanvasFormat();

const no = () => alert("WEBGPU ONLY.");

if (!gpu) no();

const adapter = await gpu.requestAdapter();

if (!adapter) no();

export const system = await adapter!.requestDevice();

system.addEventListener(
  "uncapturederror",
  ({ error }) => console.error(error.message),
);
