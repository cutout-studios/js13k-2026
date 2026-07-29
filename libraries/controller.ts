export class Controller {
  activeInputs = new Set<string>();

  constructor(type = "mouse+keyboard") {
    if (type === "mouse+keyboard") {
      globalThis.addEventListener(
        "keydown",
        ({ code }) => this.activeInputs.add(code),
      );
      globalThis.addEventListener(
        "keyup",
        ({ code }) => this.activeInputs.delete(code),
      );
      globalThis.addEventListener("blur", () => this.activeInputs.clear());
    }
  }
}
