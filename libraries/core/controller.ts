export class Controller {
  inputs = new Set<string>();

  constructor(source = "keyboard") {
    if (source === "keyboard") {
      globalThis.addEventListener(
        "keydown",
        ({ code }) => this.inputs.add(code),
      );
      globalThis.addEventListener(
        "keyup",
        ({ code }) => this.inputs.delete(code),
      );
    }
  }
}
