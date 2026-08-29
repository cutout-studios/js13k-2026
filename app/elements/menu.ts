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

import { _, preventDefault } from "~/alias";
import { doTimes } from "~/common";
import { createElement } from "~/dom";
import { createCamera, createRenderTarget } from "~/3D";

import {
  BACKGROUND,
  BLOCK,
  BORDER,
  FLEX_CENTER,
  FLEX_COLUMN,
  FLEX_ROW,
  FULL_SIZE,
  HIDDEN,
  JUSTIFY,
  PADDED,
  POINTER,
} from "../styles.ts";

import { portrait } from "./portrait.ts";
import { Game } from "../game/types.ts";
import { GPURenderTarget } from "../../libraries/3D/types.ts";

let hoveredCellIndex = -1;

const CELL_SIZE = { width: 128, height: 128 },
  FORM_COLUMN = [FLEX_COLUMN, FLEX_CENTER, JUSTIFY(), PADDED, { flex: 1 }],
  EQUIP_OFFSET = 2,
  INVENTORY_OFFSET = 6;
const createCellWindow = (index: number) =>
    createElement(
      "canvas",
      [CELL_SIZE, BORDER(2), POINTER],
      {
        ...CELL_SIZE,
        onmouseenter: () => hoveredCellIndex = index,
        onmouseleave: () => hoveredCellIndex = -1,
      },
    ) as HTMLCanvasElement,
  createFormButton = (value: string) =>
    createElement(
      "button",
      [BACKGROUND, BORDER(), PADDED, POINTER],
      { value },
      value,
    );

const canvasCells = doTimes(18, createCellWindow),
  menuCamera = createCamera(),
  [
    patronCanvasCell,
    combinationCanvasCell,
    leftWingCanvasCell,
    rightWingCanvasCell,
    bodyCanvasCell,
    engineCanvasCell,
    ...inventoryCanvasCells
  ] = canvasCells;

export const menu = createElement(
  "dialog",
  [FULL_SIZE, BACKGROUND, {
    margin: "auto",
    ["max-width"]: "min-content",
    ["max-height"]: CELL_SIZE.height * 5,
  }],
  { oncancel: preventDefault },
  createElement(
    "form",
    [FULL_SIZE, FLEX_ROW],
    {
      onsubmit: (event: SubmitEvent) => {
        preventDefault(event);

        const { target, submitter } = event;

        dispatchEvent(
          new CustomEvent((submitter as HTMLButtonElement).value, {
            detail: new FormData(target as HTMLFormElement).getAll("i"),
          }),
        );

        (target as HTMLFormElement).reset();
      },
    },
    createElement(
      "section",
      FORM_COLUMN,
      _,
      createElement(
        "div",
        [{
          display: "grid",
          grid: "repeat(4, 1fr) / repeat(3, 1fr)",
        }],
        _,
        ...doTimes(12, (value: number) =>
          createElement(
            "label",
            [BLOCK],
            _,
            createElement("input", [HIDDEN], {
              type: "checkbox",
              name: "i",
              value,
            }),
            inventoryCanvasCells[value],
          )),
      ),
    ),
    createElement(
      "section",
      FORM_COLUMN,
      _,
      createElement(
        "div",
        [FLEX_COLUMN],
        _,
        createElement("span", [FLEX_ROW, FLEX_CENTER], _, bodyCanvasCell),
        createElement(
          "span",
          [FLEX_ROW, FLEX_CENTER],
          _,
          leftWingCanvasCell,
          rightWingCanvasCell,
        ),
        createElement("span", [FLEX_ROW, FLEX_CENTER], _, engineCanvasCell),
      ),
      createFormButton("EQUIP"),
    ),
    createElement(
      "section",
      FORM_COLUMN,
      _,
      patronCanvasCell,
      createElement(
        "div",
        [FLEX_ROW, FLEX_CENTER, {
          width: CELL_SIZE.width * 2.5,
          height: CELL_SIZE.height * 2,
          background: "white",
          ["margin-top"]: "2rem",
          ["clip-path"]:
            "polygon(30% 0%, 0% 50%, 30% 100%, 70% 100%, 100% 50%, 70% 0%)",
        }],
        _,
        combinationCanvasCell,
      ),
      createFormButton("COMMIT"),
    ),
  ),
) as HTMLDialogElement;

let renderTargets: GPURenderTarget[];
export const openMenu = ([[, , inventory]]: Game) => {
  renderTargets ||= doTimes(canvasCells, createRenderTarget);
  menu.showModal();
  menuCamera([[portrait]], renderTargets[0]);

  doTimes(inventory, ([item, equipped], index) => {
    menuCamera([[item[0]]], renderTargets[index + INVENTORY_OFFSET]);
    if (equipped) {
      menuCamera([[item[0]]], renderTargets[item[3] + EQUIP_OFFSET]);
    }
  });
};

export const updateMenu = ([[, , inventory]]: Game, tickLength: number) => {
  const entry = inventory[hoveredCellIndex - INVENTORY_OFFSET];

  if (!entry) return;

  const [item, equipped] = entry;

  item[1](item, tickLength);

  menuCamera([[item[0]]], renderTargets[hoveredCellIndex]);

  if (equipped) menuCamera([[item[0]]], renderTargets[item[3] + EQUIP_OFFSET]);
};
