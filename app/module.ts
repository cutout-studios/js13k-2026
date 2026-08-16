/**
 *    Copyright 2026 Cutout Studios LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference lib="dom" />

export { drawEnemies, drawItem, getWaveCount } from "./decks.ts";
export { getBaseStats } from "./stats.ts";

import { addEventListener, appendChild, createElement } from "./alias.ts";

// will definitely need some version of these
export * from "~clock";
export * from "~3D";
export { createAudioSource } from "~audio";

// attach controller
const activeInputs = new Set();

addEventListener(
  "keydown",
  ({ code }) => activeInputs.add(code),
);
addEventListener(
  "keyup",
  ({ code }) => activeInputs.delete(code),
);
addEventListener("blur", () => activeInputs.clear());

const style = (node: HTMLElement, object: Record<string, unknown>) => {
  for (const key in object) node.style[key] = object[key];
};

// setup html
const [canvas, nav] = ["canvas", "nav"].map(createElement);

style(
  canvas,
  { width: "100%", height: "100%" },
);

style(
  nav,
  { top: 0, left: 0, position: "absolute", pointerEvents: "none" },
);

[canvas, nav].forEach((node) => appendChild(node));
