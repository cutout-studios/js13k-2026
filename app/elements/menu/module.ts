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
import { _, join, preventDefault } from "~/alias";
import { createActionSequencer } from "~/clock";
import { doTimes, flat, repeat } from "~/common";
import { createElement, createTextNode } from "~/dom";
import { oneOf } from "~/random";

import GameOptions from "../../game/options/module.ts";
import { Item } from "../../game/player/types.ts";
import { WORDS } from "../../game/ship/constants.ts";
import { Game } from "../../game/types.ts";
import { portrait } from "../portrait.ts";
import {
  BORDER,
  FLEX,
  FULL_PERCENT,
  HALF_PERCENT,
  HIDDEN,
  INERT,
  percent,
  POINTER,
  px,
  rem,
  SECONDARY,
  SQUARE,
} from "../styles.ts";

import { itemPopover, updateItemPopover } from "./itemPopover.ts";

let hoveredCellIndex = -1, restorePreviewItem: Item | undefined;

const CELL_SIDE = 128,
  CELL_SIZE = SQUARE(px(CELL_SIDE)),
  EQUIP_OFFSET = 2,
  INVENTORY_OFFSET = 6,
  _HALF_HEX = [[0, 50], [30, 100], [70, 100]],
  WIN_COLLECTION_VERTICIES = flat(
    doTimes(_HALF_HEX, ([x, y]) => [percent(x), percent(y)]),
    doTimes(_HALF_HEX, ([x, y]) => [percent(100 - x), percent(100 - y)]),
  ),
  createCellWindow = (index: number) =>
    createElement(
      "canvas",
      [CELL_SIZE, POINTER],
      CELL_SIZE,
      {
        onmouseenter: () => hoveredCellIndex = index,
        onmouseleave: () => hoveredCellIndex = -1,
      },
    ) as HTMLCanvasElement,
  createFormButton = (value: string) =>
    createElement(
      "button",
      [POINTER],
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
      createElement([BORDER, INERT, SQUARE(px(16)), {
        position: "absolute",
        top,
        left,
        borderRadius: FULL_PERCENT,
        transform: `translate(${join(repeat(2, "-" + HALF_PERCENT))}`,
      }]),
  ),
  form = createElement(
    "form",
    [SQUARE()],
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
    createElement(
      createElement(
        [{
          display: "grid",
          grid: join(repeat(2, "repeat(4,1fr)"), "/"),
          gap: rem(0.33),
        }],
        ...doTimes(12, (value: number) =>
          createElement(
            "label",
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
      createElement(
        [FLEX("column")],
        createElement(bodyCanvasCell),
        createElement(
          leftWingCanvasCell,
          rightWingCanvasCell,
        ),
        createElement(engineCanvasCell),
      ),
      createFormButton(WORDS[26]),
    ),
    createElement(
      "section",
      patronCanvasCell,
      createElement(
        createElement(
          [
            SECONDARY,
            SQUARE(px(CELL_SIDE * 2)),
            {
              cursor: "help",
              clipPath: `polygon(${
                join(
                  doTimes(
                    WIN_COLLECTION_VERTICIES,
                    (coords) => join(coords, " "),
                  ),
                )
              })`,
            },
          ],
          combinationCanvasCell,
        ),
        ...winCollectionElements,
      ),
      createFormButton(WORDS[9]),
    ),
  ) as HTMLFormElement,
  getFormValues = () => doTimes(new FormData(form).getAll("i"), Number),
  restorePreviewSequence = createActionSequencer<
    [item: Item, equipped?: boolean | undefined][]
  >([
    [(inventory) => {
      restorePreviewItem = oneOf(doTimes(
        getFormValues(),
        (value) => inventory[value][0],
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

export const menu = createElement(
  "dialog",
  [SQUARE(), SQUARE("min-content", "max")],
  {
    oncancel: preventDefault,
    onmousemove: ({ clientX, clientY }: MouseEvent) => {
      const { width, height } = itemPopover.getBoundingClientRect();
      itemPopover.style.top = px(
        clientY + height > innerHeight ? clientY - height : clientY,
      );
      itemPopover.style.left = px(
        clientX + width > innerWidth ? clientX - width : clientX,
      );
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

export const updateMenu = (
  [[, , inventory], [, , , winCollection]]: Game,
  tickLength: number,
) => {
  doTimes(winCollectionElements, (element, index) =>
    winCollection.has(index) &&
    (element.style.background = "#" + GameOptions[index][1].toString(16)));

  restorePreviewSequence(inventory, tickLength);

  const entry = inventory[hoveredCellIndex - INVENTORY_OFFSET];

  if (!entry) return Object.assign(itemPopover.style, HIDDEN);

  updateItemPopover(entry[0]);
  itemPopover.style.visibility = "visible";

  const [item, equipped] = entry;

  item[1](item, tickLength);

  menuCamera([[item[0]]], renderTargets[hoveredCellIndex]);

  if (equipped) menuCamera([[item[0]]], renderTargets[item[2] + EQUIP_OFFSET]);
};
