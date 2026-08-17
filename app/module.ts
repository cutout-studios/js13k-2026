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

import { appendChild } from "~alias";
import { startClock } from "~clock";
import { addXYZ, setupDevice, XYZ } from "~3D";

import { canvas, mapClientXY, render } from "./canvas.ts";
import { aimShip, getStrafeBindings, ship, TEMP_STRAFE_SPEED } from "./ship.ts";
// export { drawEnemies, drawItem, getWaveCount } from "./decks.ts";

// --- main loop
onload = async () => {
  await setupDevice();

  appendChild(canvas);

  startClock((tickLength) => {
    let strafeAdjust: XYZ = [0, 0, 0];
    const strafeKeybinds = getStrafeBindings(tickLength * TEMP_STRAFE_SPEED);

    for (const inputKeyCode of keyboardState) {
      strafeAdjust = addXYZ(
        strafeKeybinds[inputKeyCode] ?? [0, 0, 0],
        strafeAdjust,
      );
    }

    ship.object.adjust(strafeAdjust);

    if (pointerState) {
      aimShip(
        ship,
        mapClientXY(pointerState[0]),
      );
    }

    render([ship.object]);
  });
};

// --- attach controller
// TODO: sanitize potential input
const keyboardState = new Set<string>();

onkeydown = ({ code }) => keyboardState.add(code);
onkeyup = ({ code }) => keyboardState.delete(code);

let pointerState: [[x: number, y: number], buttons: number] | undefined;
onpointerdown = onpointerup = onpointermove = (
  { clientX, clientY, buttons },
) => pointerState = [[clientX, clientY], buttons];

// suppress browser behavior
onblur = () => keyboardState.clear();
oncontextmenu = () => false;
