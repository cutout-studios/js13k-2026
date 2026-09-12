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
import GameState, {
  getSceneObjects,
  updateBackgroundStars,
} from "./game/module.ts";
// import { updateParticles } from "./game/particles.ts";
import {
  applyInputToPlayerShip,
  checkAKey,
  checkDKey,
  checkFKey,
  checkLMouseButton,
  checkMousePointer,
  checkRMouseButton,
  checkSKey,
  checkSpaceBar,
  checkWKey,
} from "./game/player/controls.ts";
import { updateWeaponMounts } from "./game/ship/module.ts";
import { endGame, updateGame } from "./game/update.ts";

const checkKeyboard = (tickLength: number) =>
  doTimes([
    checkWKey,
    checkAKey,
    checkSKey,
    checkDKey,
    checkSpaceBar,
  ], (f) => f(tickLength));
const checkMouse = (tickLength: number) =>
  doTimes(
    [checkMousePointer, checkLMouseButton, checkRMouseButton],
    (f) => f(tickLength),
  );

startClock((tickLength) => {
  updateBackgroundStars(tickLength);

  // game hasn't started yet
  if (!GameState[2]) {
    checkKeyboard(tickLength);
    checkMouse(tickLength);
    applyInputToPlayerShip(tickLength);
    updateWeaponMounts(GameState[0][0]);
    GameState[0][0][3](GameState[0][0], tickLength);
    updateHUD(GameState, tickLength);
    return camera(getSceneObjects(GameState), mainCanvas);
  }

  // game has started, but is paused
  checkFKey(tickLength);
  if (menu.open) return updateMenu(tickLength);

  // game has started
  checkKeyboard(tickLength);
  checkMouse(tickLength);
  applyInputToPlayerShip(tickLength);
  updateGame(GameState, tickLength), updateHUD(GameState, tickLength);
  camera(getSceneObjects(GameState), mainCanvas);

  if (GameState[0][0][4][2] >= GameState[0][0][5][0]) endGame("FAILED");
});
