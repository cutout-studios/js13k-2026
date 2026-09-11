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

import { CAMERA_MAGNIFICATION_RATIO, createRenderTarget, XYZ } from "~/3D";
import { abs } from "~/alias";
import { PLAYER_AIM_Z_PLANE } from "../game//options/base.ts";
import { mainCanvas as mainCanvasElement } from "./handles.ts";

export let mainCanvas = createRenderTarget(mainCanvasElement);
onresize = () => mainCanvas = createRenderTarget(mainCanvasElement);

// half-width/half-height the camera can currently see at a given depth
export const visibleHalfExtentAt = (z: number): [x: number, y: number] => {
  const scale = abs(z) / CAMERA_MAGNIFICATION_RATIO;
  return [scale * mainCanvas[0], scale];
};

export const isPointVisible = ([x, y, z]: XYZ) => {
  const [xHalf, yHalf] = visibleHalfExtentAt(z);
  return abs(x) < xHalf && abs(y) < yHalf;
};

export const mapClientXYToZPlane = (
  clientX: number,
  clientY: number,
  plane = PLAYER_AIM_Z_PLANE,
): XYZ =>
  [
    (2 * clientX - mainCanvasElement.clientWidth) /
    (mainCanvasElement.clientHeight * CAMERA_MAGNIFICATION_RATIO) * plane,
    (mainCanvasElement.clientHeight - 2 * clientY) /
    (mainCanvasElement.clientHeight * CAMERA_MAGNIFICATION_RATIO) * plane,
    -plane,
  ] as XYZ;
