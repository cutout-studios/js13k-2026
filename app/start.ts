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

import { createRenderTarget, XOCamera } from "~3D";
import { startClock } from "~clock";
import { XOController } from "~controller";

import { CAMERA_CONTROLLER_MAP, CAMERA_STARTING_POINT } from "./constants.ts";
import { paintCube, theCubes } from "./theCubes.ts";
import { canvas } from "./html.tsx";

const camera = new XOCamera(), controller = new XOController();

camera.adjust(CAMERA_STARTING_POINT);

startClock((tickLength, totalClockTime) => {
  for (const inputKeyCode of controller.activeInputs) {
    camera.adjust(...(CAMERA_CONTROLLER_MAP[inputKeyCode]?.(tickLength) ?? []));
  }

  theCubes.forEach((cube, index) => {
    cube.adjust(undefined, [[tickLength, tickLength, tickLength], tickLength]);
    cube.material = paintCube(index + Math.floor(totalClockTime));
  });

  camera.render(theCubes, createRenderTarget(canvas));
});
