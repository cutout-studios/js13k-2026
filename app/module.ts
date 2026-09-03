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

import { startClock } from "~/clock";
import { doTimes } from "~/common";

import { camera } from "./camera.ts";
import { menu } from "./elements/handles.ts";
import { updateHUD } from "./elements/hud.ts";
import { mainCanvas } from "./elements/mainCanvas.ts";
import { updateMenu } from "./elements/menu.ts";
import GameState, { getSceneObjects } from "./game/module.ts";
import {
  applyInputToPlayerShip,
  checkAKey,
  checkDKey,
  checkEscapeKey,
  checkLMouseButton,
  checkMousePointer,
  checkRMouseButton,
  checkSKey,
  checkSpaceBar,
  checkWKey,
} from "./game/player/controls.ts";
import { updateGame } from "./game/update.ts";

startClock((tickLength) => {
  doTimes([
    checkWKey,
    checkAKey,
    checkSKey,
    checkDKey,
    checkSpaceBar,
    checkMousePointer,
    checkLMouseButton,
  ], (f) => f(tickLength));

  // game hasn't started yet
  if (!GameState[2]) {
    applyInputToPlayerShip(tickLength);
    updateHUD(GameState, tickLength);
    return camera(getSceneObjects(GameState), mainCanvas);
  }

  // game has started, but is paused
  checkEscapeKey(tickLength);
  if (menu.open) return updateMenu(tickLength);

  // game has started
  checkRMouseButton(tickLength);
  applyInputToPlayerShip(tickLength);
  updateGame(GameState, tickLength), updateHUD(GameState, tickLength);
  camera(getSceneObjects(GameState), mainCanvas);
});
