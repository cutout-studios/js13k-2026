import { system as graphics } from "~graphics";

export function wgsl(
  strings: TemplateStringsArray,
  ...values: unknown[]
): GPUShaderModule {
  let code = "";

  for (const index in strings) {
    code += strings[index];
    if (values[index]) code += String(values[index]);
  }

  return graphics.createShaderModule({ code });
}
