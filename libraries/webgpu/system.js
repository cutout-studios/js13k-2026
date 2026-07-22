export const gpu = globalThis.navigator.gpu;
export const format = gpu.getPreferredCanvasFormat();

const no = () => alert("WEBGPU ONLY.");

if (!gpu) no();

const adapter = await gpu.requestAdapter();

if (!adapter) no();

export default await adapter.requestDevice();
