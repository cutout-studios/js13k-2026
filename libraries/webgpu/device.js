import { gpu } from "./gpu.js";

if (!gpu) {
  throw new Error("WebGPU not supported.");
}

const adapter = await gpu.requestAdapter();

if (!adapter) {
  throw new Error("Could not request adapter.");
}

export const device = await adapter.requestDevice();
