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

import { createCamera, createRenderTarget, GPURenderTarget } from "~/3D";
import { join, preventDefault } from "~/alias";
import { createActionSequencer } from "~/clock";
import { doTimes, flat, repeat } from "~/common";
import { createElement, createTextNode, updateStyles } from "~/dom";
import { oneOf } from "~/random";
import GameOptions from "../../game/options/module.ts";
import { Item } from "../../game/player/types.ts";
import { WORDS } from "../../game/ship/constants.ts";
import { Game } from "../../game/types.ts";
import { portrait } from "../portrait.ts";
import {
  px,
  ABSOLUTE,
  AT,
  BORDER,
  CONTENT,
  HELP,
  HIDDEN,
  INERT,
  MAX_SIZE,
  pct,
  POINTER,
  RELATIVE,
  SECONDARY,
  SHOWN,
  SIZING,
  LAYOUT,
  rem,
} from "../styles.ts";
import { itemPopover, updateItemPopover } from "./itemPopover.ts";

let hoveredCellIndex = -1, restorePreviewItem: Item | undefined;

const CELL_SIDE = 128,
  CELL_SIZE = SIZING(CELL_SIDE),
  EQUIP_OFFSET = 2,
  INVENTORY_OFFSET = 6,
  _HALF_HEX = [[0, .5], [0.3, 1], [0.7, 1]],
  WIN_COLLECTION_VERTICIES = flat(
    doTimes(_HALF_HEX, ([x, y]) => [pct(x), pct(y)]),
    doTimes(_HALF_HEX, ([x, y]) => [pct(1 - x), pct(1 - y)]),
  ),
  place = (element: HTMLElement, gridArea: string) => updateStyles(element, { gridArea }),
  createCellWindow = (index: number) =>
    createElement(
      "canvas",
      [CELL_SIZE, POINTER, BORDER],
      {
        onmouseenter: () => hoveredCellIndex = index,
        onmouseleave: () => hoveredCellIndex = -1,
      },
    ) as HTMLCanvasElement,
  createFormButton = (value: string, gridArea: string) =>
    createElement(
      "button",
      [POINTER, CONTENT(), AT(gridArea), { padding: rem(1) }, BORDER],
      { value },
      createTextNode(value),
    ),
  canvasCells = doTimes(18, createCellWindow),
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
      createElement([BORDER, INERT, ABSOLUTE, SIZING(16), {
        top,
        left,
        borderRadius: pct(1),
        transform: "translate(-50%,-50%)",
      }]),
  ),
  inventoryGrid = createElement(
    [
      LAYOUT(
        repeat(3, "auto"),
        repeat(4, "auto"),
        0.33,
        0,
      ),
      AT("1/1/3/2", "start"),
    ],
    ...doTimes(12, (value: number) =>
      createElement(
        "label",
        [POINTER, CONTENT(0)],
        createElement("input", [HIDDEN, ABSOLUTE], {
          type: "checkbox",
          name: "i",
          value,
        }),
        inventoryCanvasCells[value],
      )),
  ),
  shipGrid = createElement(
    [LAYOUT(repeat(2, "auto"), repeat(3, "auto"), 0.33, 0), AT("1/2", "start")],
    place(bodyCanvasCell, "1/1/2/3"),
    place(leftWingCanvasCell, "2/1"),
    place(rightWingCanvasCell, "2/2"),
    place(engineCanvasCell, "3/1/4/3"),
  ),
  hexagon = createElement(
    [SECONDARY, HELP, SIZING(CELL_SIDE * 2, CELL_SIDE * 1.6), {
      display: "grid",
      placeItems: "center",
      clipPath: `polygon(${
        join(doTimes(WIN_COLLECTION_VERTICIES, (coords) => join(coords)), ",")
      })`,
    }],
    combinationCanvasCell,
  ),
  patronPanel = createElement(
    [LAYOUT(["auto"], repeat(2, "auto"), 2, 0), AT("1/3", "start")],
    patronCanvasCell,
    createElement(
      [RELATIVE, SIZING("fit-content")],
      hexagon,
      ...winCollectionElements,
    ),
  ),
  form = createElement(
    "form",
    [LAYOUT(repeat(3, "auto"), ["auto", "min-content"], 3)],
    {
      onsubmit: (event: SubmitEvent) => {
        preventDefault(event);
        const { target, submitter } = event;
        dispatchEvent(
          new CustomEvent((submitter as HTMLButtonElement).value, {
            detail: getFormValues(),
          }),
        );
        (target as HTMLFormElement).reset();
      },
    },
    inventoryGrid,
    shipGrid,
    createFormButton(WORDS[25], "2/2"),
    patronPanel,
    createFormButton(WORDS[9], "2/3"),
  ) as HTMLFormElement,
  getFormValues = () => doTimes(new FormData(form).getAll("i"), Number),
  restorePreviewSequence = createActionSequencer<
    [item: Item, equipped?: boolean | undefined][]
  >([
    [(inventory) => {
      restorePreviewItem = oneOf(doTimes(
        getFormValues(),
        (value) => inventory[value]?.[0],
      ));
    }],
    [(_inventory, tickLength) => {
      restorePreviewItem?.[1](restorePreviewItem, tickLength);
      menuCamera(
        restorePreviewItem ? [[restorePreviewItem[0]]] : [],
        renderTargets[1],
      );
    }, 0.5],
  ]);

export const menu = createElement(
  "dialog",
  [MAX_SIZE("min-content", "90svh"), {
    margin: "auto",
    padding: "0",
    border: "0",
    overflow: "auto",
  }],
  {
    oncancel: preventDefault,
    onmousemove: ({ clientX, clientY }: MouseEvent) => {
      const { width, height } = itemPopover.getBoundingClientRect();

      updateStyles(itemPopover, {
        top: px(clientY + height > innerHeight ? clientY - height : clientY),
        left: px(clientX + width > innerWidth ? clientX - width : clientX),
      });
    },
  },
  form,
  itemPopover,
) as HTMLDialogElement;

let renderTargets: GPURenderTarget[];

export const openMenu = ([[, , inventory], [, , , winCollection]]: Game) => {
  menu.showModal();
  renderTargets ||= doTimes(canvasCells, createRenderTarget);
  
  doTimes(winCollectionElements, (element, index) =>
    winCollection.has(index) &&
    (element.style.background = "#" + GameOptions[index][1].toString(16)));
  
    menuCamera([[portrait]], renderTargets[0]);

  doTimes(inventory, ([item, equipped], index) => {
    menuCamera([[item[0]]], renderTargets[index + INVENTORY_OFFSET]);
    if (equipped) {
      menuCamera([[item[0]]], renderTargets[item[2] + EQUIP_OFFSET]);
    }
  });
};

export const updateMenu = (
  [[, , inventory]]: Game,
  tickLength: number,
) => {
  restorePreviewSequence(inventory, tickLength);
  
  const entry = inventory[hoveredCellIndex - INVENTORY_OFFSET];
  if (!entry) return updateStyles(itemPopover, HIDDEN);
  
  updateItemPopover(entry[0]);
  updateStyles(itemPopover, SHOWN);
  
  const [item, equipped] = entry;
  item[1](item, tickLength);

  menuCamera([[item[0]]], renderTargets[hoveredCellIndex]);

  if (equipped) menuCamera([[item[0]]], renderTargets[item[2] + EQUIP_OFFSET]);
};
