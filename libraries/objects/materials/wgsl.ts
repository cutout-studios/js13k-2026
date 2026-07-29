import type { Shader } from "./types.ts";

export function wgsl(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Shader {
  let code = "";

  for (const index in strings) {
    code += strings[index];
    if (values[index] !== undefined) code += String(values[index]);
  }

  return code;
}
