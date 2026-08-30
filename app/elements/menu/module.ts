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

import { oneOf } from "~/random";
import { _, preventDefault } from "~/alias";
import { doTimes } from "~/common";
import { createElement } from "~/dom";
import { createCamera, createRenderTarget, GPURenderTarget } from "~/3D";

import {
  BACKGROUND,
  BLOCK,
  BORDER,
  FLEX_CENTER,
  FLEX_COLUMN,
  FLEX_ROW,
  HIDDEN,
  JUSTIFY,
  PADDED,
  POINTER,
  SQUARE,
} from "../../styles.ts";

import { portrait } from "../portrait.ts";
import GameOptions from "../../game/options/module.ts";
import { Game } from "../../game/types.ts";
import { itemPopover, updateItemPopover } from "./itemPopover.ts";
import { createActionSequencer } from "~/clock";
import { Item } from "../../game/player/types.ts";

const CELL_SIZE = SQUARE(128),
  FORM_COLUMN = [FLEX_COLUMN, FLEX_CENTER, JUSTIFY(), PADDED, { flex: 1 }],
  EQUIP_OFFSET = 2,
  INVENTORY_OFFSET = 6,
  WIN_COLLECTION_VERTICIES = [
    ["30%", "0%"],
    ["0%", "50%"],
    ["30%", "100%"],
    ["70%", "100%"],
    ["100%", "50%"],
    ["70%", "0%"],
  ];

let hoveredCellIndex = -1;

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
  ] = canvasCells,
  winCollectionElements = doTimes(
    WIN_COLLECTION_VERTICIES,
    ([left, top]) =>
      createElement("span", [BORDER(2), BACKGROUND, SQUARE("1rem"), {
        ["border-radius"]: "100%",
        transform: "translate(-50%,-50%)",
        ["pointer-events"]: "none",
        position: "absolute",
        top,
        left,
      }]),
  );

const form = createElement(
  "form",
  [SQUARE(), FLEX_ROW],
  {
    onsubmit: (event: SubmitEvent) => {
      preventDefault(event);

      const { target, submitter } = event;

      dispatchEvent(
        new CustomEvent((submitter as HTMLButtonElement).value, {
          detail: new FormData(target as HTMLFormElement).getAll("i").map(
            Number,
          ),
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
        gap: "0.33rem",
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
      [BLOCK],
      _,
      createElement(
        "div",
        [FLEX_ROW, FLEX_CENTER, {
          width: +CELL_SIZE.width * 2.5,
          height: +CELL_SIZE.height * 2,
          cursor: "help",
          background: "white",
          ["clip-path"]: `polygon(${
            doTimes(WIN_COLLECTION_VERTICIES, (coords) => coords.join(" "))
              .join()
          })`,
        }],
        _,
        combinationCanvasCell,
      ),
      ...winCollectionElements,
    ),
    createFormButton("RESTORE"),
  ),
) as HTMLFormElement;

export const menu = createElement(
  "dialog",
  [SQUARE(), BACKGROUND, {
    margin: "auto",
    ["max-width"]: "min-content",
    ["max-height"]: +CELL_SIZE.height * 5,
  }],
  {
    oncancel: preventDefault,
    onmousemove: ({ clientX, clientY }: MouseEvent) => {
      const { width, height } = itemPopover.getBoundingClientRect();
      itemPopover.style.top =
        (clientY + height > innerHeight ? clientY - height : clientY) + "px";
      itemPopover.style.left =
        (clientX + width > innerWidth ? clientX - width : clientX) + "px";
    },
  },
  form,
  itemPopover,
) as HTMLDialogElement;

let renderTargets: GPURenderTarget[];
export const openMenu = ([[, , inventory]]: Game) => {
  menu.showModal();
  renderTargets ||= doTimes(canvasCells, createRenderTarget);

  menuCamera([[portrait]], renderTargets[0]);

  doTimes(inventory, ([item, equipped], index) => {
    menuCamera([[item[0]]], renderTargets[index + INVENTORY_OFFSET]);
    if (equipped) {
      menuCamera([[item[0]]], renderTargets[item[2] + EQUIP_OFFSET]);
    }
  });
};

let restorePreviewItem: Item | undefined;
const restorePreviewSequence = createActionSequencer<
  [item: Item, equipped?: boolean | undefined][]
>([
  [(inventory) => {
    restorePreviewItem = oneOf(doTimes(
      new FormData(form).getAll("i") as string[],
      (value: string) => inventory[+value][0],
    ));
  }],
  [(_, tickLength) => {
    restorePreviewItem?.[1](restorePreviewItem, tickLength);
    menuCamera(
      restorePreviewItem ? [[restorePreviewItem[0]]] : [],
      renderTargets[1],
    );
  }, 0.5],
]);

export const updateMenu = (
  [[, , inventory], [, , , winCollection]]: Game,
  tickLength: number,
) => {
  doTimes(winCollectionElements, (element, index) =>
    winCollection.has(index) &&
    (element.style.background = "#" + GameOptions[index][1].toString(16)));

  restorePreviewSequence(inventory, tickLength);

  const entry = inventory[hoveredCellIndex - INVENTORY_OFFSET];

  if (!entry) return itemPopover.style.visibility = "hidden";

  updateItemPopover(entry[0]);
  itemPopover.style.visibility = "visible";

  const [item, equipped] = entry;

  item[1](item, tickLength);

  menuCamera([[item[0]]], renderTargets[hoveredCellIndex]);

  if (equipped) menuCamera([[item[0]]], renderTargets[item[2] + EQUIP_OFFSET]);
};
