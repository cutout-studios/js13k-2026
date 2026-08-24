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

import {
  CAMERA_MAGNIFICATION_RATIO,
  createCamera,
  createRenderTarget,
  XOObject,
  XYZ,
} from "~/3D";
import { createElement } from "~/dom";

import { DEPTH_LIMIT } from "./constants.ts";

export const mainCanvas = createElement("canvas", [{
    width: "100%",
    height: "100%",
    display: "block",
    cursor: "crosshair",
  }]) as HTMLCanvasElement,
  camera = createCamera();

export const renderMain = (objects: XOObject[][]) =>
  camera(objects, createRenderTarget(mainCanvas as HTMLCanvasElement));

export const mapClientXY = (
  [clientX, clientY]: [number, number],
  distance = DEPTH_LIMIT,
): XYZ => {
  const { clientWidth, clientHeight, offsetLeft, offsetTop } = mainCanvas;

  const scale = distance / (clientHeight * CAMERA_MAGNIFICATION_RATIO);
  return [
    (2 * (clientX - offsetLeft) - clientWidth) * scale,
    (clientHeight - 2 * (clientY - offsetTop)) * scale,
    -distance,
  ];
};
