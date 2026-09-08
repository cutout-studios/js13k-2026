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

import { createCamera, createRenderTarget, setOrigin } from "~/3D";
import { startClock } from "~/clock";
import { doTimes, flatDoTimes } from "~/common";

import GameOptions from "../../app/game/options/module.ts";
import { createShip, getShipObjects } from "../../app/game/ship/module.ts";
import { Ship } from "../../app/game/ship/types.ts";

// a ship spawned this far out gives swoop/arc-in style behaviors room to
// actually travel before settling, without needing the real spawn/wave logic
const SPAWN_ORIGIN = [0, 0, -12] as const;

const canvasElement = document.getElementById("canvas") as HTMLCanvasElement,
  camera = createCamera();

let renderTarget = createRenderTarget(canvasElement);
onresize = () => renderTarget = createRenderTarget(canvasElement);

const activeShips: Ship[] = [];

const spawnShip = (colorIndex: number) => {
  const ship = createShip(colorIndex);

  setOrigin(ship[0][0], [...SPAWN_ORIGIN]);
  activeShips.push(ship);
};

const shipButtons = document.getElementById("shipButtons")!;

doTimes(GameOptions, ([name], colorIndex: number) => {
  const button = document.createElement("button");

  button.textContent = name;
  button.onclick = () => spawnShip(colorIndex);
  shipButtons.appendChild(button);
});

document.getElementById("clearShips")!.onclick = () => {
  activeShips.length = 0;
};

startClock((tickLength) => {
  doTimes(activeShips, (ship) => ship[3](ship, tickLength));
  camera(flatDoTimes(activeShips, getShipObjects), renderTarget);
});
