import graphics from "~graphics";

export function wgsl(strings, ...values) {
  let code = "";

  for (const index in strings) {
    code += strings[index];
    if (values[index]) code += String(values[index]);
  }

  return graphics.createShaderModule({ code });
}
