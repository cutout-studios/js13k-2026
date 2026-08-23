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

import { doTimes, OneOrMore } from "~/common";
import { document } from "~/alias";
import { startClock } from "~/clock";
import { setupDevice, XOObject } from "~/3D";
import { createElement } from "~/dom";

import { mainCanvas, renderMain } from "./elements/mainCanvas.ts";
import { hud } from "./elements/hud.ts";
import state, { getScene, updateGame } from "./state/module.ts";
import { COLORS } from "./state/constants.ts";
import { createEnemy } from "./state/world/enemies.ts";
import { setOrigin } from "../libraries/3D/coordinates.ts";

document.head.append(createElement("style", undefined, {
  textContent: /* css */ `
    html, body, body * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      font-family: Menlo, ui-monospace;
      font-size: 16px;
      color: white;
      list-style-type: none;
    }

    body {
      position: relative;
      width: 100vw;
      height: 100svh;
    }

    dialog::backdrop {
      background: #000c;
    }`,
}));

const enemies = doTimes(4, (x) =>
  doTimes(4, (y) => {
    const [object] = createEnemy(COLORS[2]);

    object[0] = setOrigin(object[0], [2 * x - 3, 2 * y - 3, -10]);

    return object;
  })).flat() as OneOrMore<XOObject>;

onload = async () => {
  await setupDevice();

  [hud, mainCanvas].forEach((element) => document.body.appendChild(element));

  startClock((tickLength) => {
    updateGame(state, tickLength);

    renderMain([...getScene(state), enemies]);
  });
};
