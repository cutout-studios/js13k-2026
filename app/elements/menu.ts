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

import { doTimes } from "~/common";
import { createElement } from "~/dom";
import {
  BORDER,
  FLEX_CENTER,
  FLEX_ROW,
  PADDED,
  PADDED_FLEX_ROW,
} from "../styles.ts";
import { createCamera } from "../../libraries/3D/camera.ts";
import { portrait } from "../state/world/client.ts";
import { createRenderTarget } from "~/3D";

const INVENTORY_SIZE = 12;

const clientSize = { width: 128, height: 128 },
  clientCanvas = createElement(
    "canvas",
    [clientSize, BORDER(2), { display: "block", margin: "auto" }],
  ) as HTMLCanvasElement,
  clientCamera = createCamera();

export const menu = createElement(
  "dialog",
  [PADDED_FLEX_ROW, FLEX_CENTER, {
    margin: "auto",
    gap: "2rem",
  }],
  undefined,
  createElement(
    "section",
    undefined,
    undefined,
    createElement(
      "ul",
      [BORDER(), {
        display: "grid",
        grid: "repeat(4, 1fr) / repeat(3, 1fr)",
        ["min-height"]: "100%",
        ["aspect-ratio"]: "3 / 4",
      }],
      undefined,
      ...(
        doTimes(INVENTORY_SIZE, () =>
          createElement(
            "li",
            [PADDED, BORDER()],
            undefined,
            // createElement("canvas", [FULL_SIZE]),
          ))
      ),
    ),
  ),
  createElement(
    "section",
    undefined,
    undefined,
    clientCanvas,
    createElement(
      "div",
      [FLEX_ROW, FLEX_CENTER, {
        width: clientSize.width * 2.5,
        height: clientSize.height * 2,
        background: "white",
        ["margin-top"]: "2rem",
        ["clip-path"]:
          "polygon(30% 0%, 0% 50%, 30% 100%, 70% 100%, 100% 50%, 70% 0%)",
      }],
      undefined,
      createElement(
        "canvas",
        [clientSize],
      ),
    ),
  ),
) as HTMLDialogElement;

export const openMenu = () => {
  menu.showModal();

  clientCamera([[portrait]], createRenderTarget(clientCanvas));
};
