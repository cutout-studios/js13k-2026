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

import { /* addEventListener, */ appendChild, createElement, PI } from "~alias";

import { startClock } from "~clock";
import {
  createCamera,
  createRenderTarget,
  paintMaterial,
  setupDevice,
  XOObject,
  XYZ,
} from "~3D";
import { createPyramid } from "./shapes.ts";

// TODO: organize these
const addXYZ = (
  [x1, y1, z1]: XYZ,
  [x2, y2, z2]: XYZ,
): XYZ => [x1 + x2, y1 + y2, z1 + z2];

const style = (node: HTMLElement, object: Record<string, string>) => {
  for (const key in object) node.style[key as never] = object[key];
};

// --- main loop
onload = async () => {
  const canvas = createElement("canvas");

  style(
    canvas,
    { width: "100%", height: "100%", display: "block" },
  );

  appendChild(canvas);

  await setupDevice();

  const render = createCamera(),
    pyramid = new XOObject(
      createPyramid([0.25, 0.1, 0.25]),
      [0, 0, -3],
      [[0, 1, 0], PI],
      paintMaterial(0xFFFFFF),
    );

  startClock((tickLength) => {
    let trackingAdjustment: XYZ = [0, 0, 0];
    const trackingBindings = getTrackBindings(tickLength);

    for (const inputKeyCode of activeKeys) {
      trackingAdjustment = addXYZ(
        trackingBindings[inputKeyCode] ?? [0, 0, 0],
        trackingAdjustment,
      );
    }

    pyramid.adjust(trackingAdjustment);

    render([
      pyramid,
    ], createRenderTarget(canvas as HTMLCanvasElement));
  });
};

// --- attach controller
// TODO: sanitize potential input
const activeKeys = new Set<string>();
const getTrackBindings = (speed: number): Record<string, XYZ> => ({
  KeyW: [0, speed, 0],
  KeyA: [-speed, 0, 0],
  KeyS: [0, -speed, 0],
  KeyD: [speed, 0, 0],
});

onkeydown = ({ code }) => activeKeys.add(code);
onkeyup = ({ code }) => activeKeys.delete(code);

// let cursor = [0, null, null];
// onpointerdown = onpointerup = onpointermove = (
//   { buttons, clientX, clientY },
// ) => cursor = [buttons, clientX, clientY];

// suppress browser behavior
onblur = () => activeKeys.clear();
oncontextmenu = () => false;
