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
  readOrigin,
  scatterObjects,
  setOrigin,
  XYZ,
} from "~/3D";
import { abs } from "~/alias";
import { startClock } from "~/clock";
import { Band, doTimes, flatDoTimes, repeat, spread } from "~/common";

import {
  PLAYER_AIM_Z_PLANE,
  PLAYER_SHIP_Z_PLANE,
} from "../../app/game/constants.ts";
import GameOptions from "../../app/game/options/module.ts";
import { setPlayerShip } from "../../app/game/player/ship.ts";
import { createShip, getShipObjects } from "../../app/game/ship/module.ts";
import { Ship } from "../../app/game/ship/types.ts";
import { updateBullets } from "../../app/game/ship/weapons/bullets.ts";

const canvasElement = document.getElementById("c") as HTMLCanvasElement,
  camera = createCamera();

let renderTarget = createRenderTarget(canvasElement);
onresize = () => renderTarget = createRenderTarget(canvasElement);

const [visibleX, visibleY] = ((z: number) => {
  const scale = abs(z) / CAMERA_MAGNIFICATION_RATIO;
  return [scale * renderTarget[0], scale];
})(PLAYER_AIM_Z_PLANE);

const bandInputs = (prefix: string, defaultBand: [Band, Band, Band]) =>
  doTimes(["X", "Y", "Z"], (axis: string, index: number) => {
    const minInput = document.getElementById(
        `${prefix}${axis}Min`,
      ) as HTMLInputElement,
      maxInput = document.getElementById(
        `${prefix}${axis}Max`,
      ) as HTMLInputElement;

    [minInput.value, maxInput.value] = doTimes(
      [...defaultBand[index]],
      (value: number) => value.toFixed(2),
    );

    return () => [+minInput.value || 0, +maxInput.value || 0] as Band;
  });

const [readSpawnX, readSpawnY, readSpawnZ] = bandInputs("spawn", [
  spread(visibleX * 0.25, 1.2 * visibleX),
  spread(visibleY * 0.25, 1.2 * visibleY),
  spread(1, -18),
]);

const [readRefX, readRefY, readRefZ] = bandInputs(
  "ref",
  repeat(3, spread(1)) as [Band, Band, Band],
);

// wire up the button UI before touching anything ship/scene related, so a
// bug further down (WebGPU, sequencers, etc.) can never take the buttons
// down with it
const errorElement = document.getElementById("error")!;
onerror = (message, _source, _line, _col, error) =>
  errorElement.textContent = error?.stack ?? String(message);

const activeShips: Ship[] = [];

const spawnShip = (colorIndex: number) => {
  const spawnRegion: [Band, Band, Band] = [
      readSpawnX(),
      readSpawnY(),
      readSpawnZ(),
    ],
    referenceBand: [Band, Band, Band] = [readRefX(), readRefY(), readRefZ()],
    ship = createShip(colorIndex, 1, referenceBand);

  scatterObjects(spawnRegion, true, ship[0]);
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

// a dummy player, kept out of activeShips - it's scenery/a target for
// spawned enemies' aimAction (which targets getPlayerShip()[0][0]) to shoot
// at, not something "Clear all" should have to special-case
const playerShip = createShip(0);
setOrigin(playerShip[0][0], [0, 0, -PLAYER_SHIP_Z_PLANE]);
setPlayerShip(playerShip);

const telemetryElement = document.getElementById("telemetry")!;

const formatXYZ = ([x, y, z]: XYZ) =>
  `${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}`;

const updateTelemetry = () =>
  telemetryElement.innerHTML = [
    ["PLAYER", playerShip] as const,
    ...doTimes(
      activeShips,
      (ship): [string, Ship] => [GameOptions[ship[6]][0], ship],
    ),
  ].map(([label, [object, aim, , , , snapshot]]) =>
    `<div><b>${label}</b><br>pos ${formatXYZ(readOrigin(object[0]))}<br>aim ${
      formatXYZ(aim)
    }<br>hp ${snapshot[11]}</div>`
  ).join("");

startClock((tickLength) => {
  doTimes([playerShip, ...activeShips], (ship) => {
    ship[3](ship, tickLength);
    updateBullets(ship, tickLength);
  });
  camera(
    flatDoTimes([playerShip, ...activeShips], getShipObjects),
    renderTarget,
  );
  updateTelemetry();
});
