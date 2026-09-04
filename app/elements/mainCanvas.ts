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
import { ENEMY_Z_PLANE } from "../game/world/constants.ts";
import { mainCanvas as mainCanvasElement } from "./handles.ts";

export let mainCanvas = createRenderTarget(mainCanvasElement);
onresize = () => mainCanvas = createRenderTarget(mainCanvasElement);

export const mapClientXYToZPlane = (
  clientX: number,
  clientY: number,
  plane = ENEMY_Z_PLANE,
): XYZ =>
  [
    (2 * clientX - mainCanvasElement.clientWidth) /
    (mainCanvasElement.clientHeight * CAMERA_MAGNIFICATION_RATIO) * plane,
    (mainCanvasElement.clientHeight - 2 * clientY) /
    (mainCanvasElement.clientHeight * CAMERA_MAGNIFICATION_RATIO) * plane,
    -plane,
  ] as XYZ;
