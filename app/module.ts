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

// export { drawEnemies, drawItem, getWaveCount } from "./decks.ts";
// export { getBaseStats } from "./stats.ts";

import { /* addEventListener, */ appendChild, createElement } from "~alias";

import { startClock } from "~clock";
import {
  createCamera,
  createRenderTarget,
  paintMaterial,
  setupDevice,
  XOObject,
} from "~3D";
import { createPyramid, createSphere } from "./shapes.ts";

// import { createAudioSource } from "~audio";

// attach controller
// const activeInputs = new Set();

// addEventListener(
//   "keydown",
//   ({ code }) => activeInputs.add(code),
// );
// addEventListener(
//   "keyup",
//   ({ code }) => activeInputs.delete(code),
// );
// addEventListener("blur", () => activeInputs.clear());

const style = (node: HTMLElement, object: Record<string, string>) => {
  for (const key in object) node.style[key as never] = object[key];
};

const start = async () => {
  const canvas = createElement("canvas");

  style(
    canvas,
    { width: "100%", height: "100%", display: "block" },
  );

  appendChild(canvas);

  await setupDevice();

  const render = createCamera(),
    sphere = new XOObject(
      createSphere(1, 12),
      [-2, 0, -5],
      undefined,
      paintMaterial(0xEE3030),
    ),
    pyramid = new XOObject(
      createPyramid(),
      [2, 0, -5],
      undefined,
      paintMaterial(0x29A9D4),
    );

  startClock((tickLength) => {
    sphere.adjust(undefined, [[0, 1, 1], tickLength]);
    pyramid.adjust(undefined, [[0, 0, 1], tickLength]);

    render([
      sphere,
      pyramid,
    ], createRenderTarget(canvas as HTMLCanvasElement));
  });
};

onload = start;
