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

import { addEventListener } from "~/alias";
import { startClock } from "~/clock";
import { keyboard } from "~/controller";

import { camera } from "./camera.ts";
import { menu, title } from "./elements/handles.ts";
import { updateHUD } from "./elements/hud.ts";
import { mainCanvas } from "./elements/mainCanvas.ts";
import { resetMenu, updateMenu } from "./elements/menu.ts";
import GameState, { getSceneObjects } from "./game/module.ts";
import { updateGame } from "./game/update.ts";

addEventListener("mousedown", () => {
  GameState[2] = true;
  title.style.opacity = "0";
});

let escapeWasDown = false;
startClock((tickLength) => {
  if (!GameState[2]) {
    const ship = GameState[0][0];
    ship[3](ship, tickLength);
    updateHUD(GameState, tickLength);
    return camera(getSceneObjects(GameState), mainCanvas);
  }
  const escapeIsDown = keyboard.has("Escape");
  if (escapeIsDown && !escapeWasDown) {
    menu.open ? menu.close() : (resetMenu(), menu.showModal());
  }
  escapeWasDown = escapeIsDown;
  if (menu.open) return updateMenu(tickLength);
  updateGame(GameState, tickLength);
  updateHUD(GameState, tickLength);
  camera(getSceneObjects(GameState), mainCanvas);
});
