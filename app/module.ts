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

import { document } from "~/alias";
import { startClock } from "~/clock";
import { setupDevice } from "~/3D";

import { mainCanvas, renderMain } from "./elements/mainCanvas.ts";
import { hud } from "./elements/hud.ts";
import state, { getScene, updateGame } from "./state/module.ts";

onload = async () => {
  await setupDevice();

  [hud, mainCanvas].forEach((element) => document.body.appendChild(element));

  startClock((tickLength) => {
    updateGame(state, tickLength);

    renderMain(getScene(state));
  });
};
