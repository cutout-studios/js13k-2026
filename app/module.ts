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

import { _, document } from "~/alias";
import { startClock } from "~/clock";
import { setupDevice } from "~/3D";
import { createElement } from "~/dom";
import { keyboard } from "~/controller";

import { mainCanvas, renderMain } from "./elements/mainCanvas.ts";
import { hud, updateHUD } from "./elements/hud.ts";
import { menu, openMenu, updateMenu } from "./elements/menu.ts";
import state, { getSceneObjects } from "./game/module.ts";
import { updateGame } from "./game/update.ts";
import { doTimes } from "~/common";

document.head.append(createElement("style", _, {
  // minified from ./styles.css
  textContent:
    "body,body *,html{box-sizing:border-box;padding:0;margin:0;font-family:Menlo, ui-monospace;font-size:16px;color:white;list-style-type:none}body{position:relative;width:100vw;height:100svh}dialog::backdrop{background:#000c}:checked + canvas{outline:3px solid yellow}",
}));

let escapeWasDown = false;
onload = async () => {
  await setupDevice();
  doTimes(
    [hud, mainCanvas, menu],
    (element) => document.body.appendChild(element),
  );
  startClock((tickLength) => {
    const escapeIsDown = keyboard.has("Escape");

    if (escapeIsDown && !escapeWasDown) {
      menu.open ? menu.close() : openMenu(state);
    }

    escapeWasDown = escapeIsDown;

    if (menu.open) return updateMenu(state, tickLength);

    updateGame(state, tickLength);
    updateHUD(state, tickLength);
    renderMain(getSceneObjects(state));
  });
};
