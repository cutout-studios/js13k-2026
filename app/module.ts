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

import { doTimes } from "~common";
import { appendChild } from "~alias";
import { startClock } from "~clock";
import { scaleXYZ, setupDevice, XYZ } from "~3D";

import { create as createEnvelope } from "../libraries/envelope.ts";

import { canvas, mapClientXY, render } from "./canvas.ts";
import { aimShip, ship, TEMP_STRAFE_SPEED } from "./ship.ts";

// export { drawEnemies, drawItem, getWaveCount } from "./decks.ts";

const STRAFE_KEYS = ["KeyD", "KeyA", "KeyW", "KeyS"];
const strafeEnvelopes = doTimes(
  STRAFE_KEYS.length,
  () => createEnvelope(0.30, 0.35),
);

// --- main loop
onload = async () => {
  await setupDevice();

  appendChild(canvas);

  startClock((tickLength) => {
    const strafeMagnitudes: XYZ = [0, 0, 0];
    doTimes(STRAFE_KEYS.length, (index: number) => {
      const value = strafeEnvelopes[index](
        tickLength,
        !keyboardState.has(STRAFE_KEYS[index]),
      );
      strafeMagnitudes[index >> 1] += index & 1 ? -value : value;
    });

    ship.object.adjust(
      scaleXYZ(strafeMagnitudes, TEMP_STRAFE_SPEED * tickLength),
    );

    if (pointerState) {
      aimShip(
        ship,
        mapClientXY(pointerState[0]),
        tickLength,
      );
    }

    render([ship.object]);
  });
};

// --- attach controller. TODO: properly manage events
const keyboardState = new Set<string>();

onkeydown = ({ code }) => keyboardState.add(code);
onkeyup = ({ code }) => keyboardState.delete(code);

let pointerState: [[x: number, y: number], buttons: number] | undefined;
onpointerdown = onpointerup = onpointermove = (
  { clientX, clientY, buttons },
) => pointerState = [[clientX, clientY], buttons];

// suppress undesired browser behavior
onblur = () => keyboardState.clear();
oncontextmenu = () => false;
