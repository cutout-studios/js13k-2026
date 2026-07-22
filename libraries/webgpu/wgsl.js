import { device } from "./system.js";

export function wgsl(strings, ...values) {
  let code = "";

  for(const index in strings) {
    code += strings[index];
    if (values[index]) code += String(values[index]);
  }

  return device.createShaderModule({ code });
}
