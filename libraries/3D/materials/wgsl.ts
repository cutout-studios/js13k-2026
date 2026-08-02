export function wgsl(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  let code = "";

  for (const index in strings) {
    code += strings[index];
    if (values[index] !== undefined) code += String(values[index]);
  }

  return code;
}
