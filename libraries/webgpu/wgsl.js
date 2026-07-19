import { device } from "./device.js";

// TODO: escape? I probably don't care
export function wgsl([code]) {
  return device.createShaderModule({ code });
}
