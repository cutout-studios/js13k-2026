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

import {
  adjustObject,
  createRenderTarget,
  GPURenderTarget,
  setOrigin,
  XYZ,
} from "~/3D";
import { join, preventDefault } from "~/alias";
import { createActionSequencer } from "~/clock";
import { doTimes, repeat, spliceTable } from "~/common";
import { updateStyles } from "~/dom";
import { oneOf } from "~/random";

import { camera } from "../camera.ts";
import GameState from "../game/module.ts";
import GameOptions from "../game/options/module.ts";
import { combineItems, createItem } from "../game/player/items.ts";
import { updatePlayerSnapshots } from "../game/player/stats.ts";
import { Item } from "../game/player/types.ts";
import { PARTS, PROPERTY_NAMES, WORDS } from "../game/ship/constants.ts";

import {
  base,
  canvasCells,
  form,
  header,
  itemPopover,
  menu,
  modifiers,
  winCollectionElements,
} from "./handles.ts";
import { portrait } from "./portrait.ts";

let hoveredCellIndex = -1,
  restorePreviewItem: Item | undefined,
  renderTargets: GPURenderTarget[];

const EQUIP_OFFSET = 2,
  INVENTORY_OFFSET = 6,
  [player, [, , progress, winCollection]] = GameState,
  [, , inventory] = player,
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
      camera(
        restorePreviewItem ? [[restorePreviewItem[0]]] : [],
        renderTargets[1],
      );
    }, 0.5],
  ]),
  equippedItems = doTimes(4, (typeID: number) => {
    const item = createItem(0, typeID, 1, 1);
    setOrigin(item[0][0], [0, 0, -1.5]);
    item[1] = createActionSequencer([[
      (item, tickLength) => {
        adjustObject(item[0], [undefined, [
          repeat(3, tickLength) as XYZ,
          tickLength,
        ]]);
      },
    ]]);
    return item;
  }),
  updateItemPopover = (
    [, , _typeID, _colorID, _rank, _modifiers, _baseMass, _baseWeapon]: Item,
  ) => {
    header.innerText = join([
      "⭑".repeat(_rank),
      GameOptions[_colorID][0],
      PARTS[_typeID],
    ]);
    modifiers.innerHTML = join(
      doTimes(
        _modifiers,
        ([id, type, value]) =>
          `${type}${value.toFixed(2)} ${PROPERTY_NAMES[id]}`,
      ),
      "<br>",
    );
    const properties = [WORDS[15], _baseMass];
    if (_baseWeapon) {
      doTimes(
        _baseWeapon,
        (value, index) =>
          properties.push([WORDS[6], WORDS[11], WORDS[2]][index], value),
      );
    }
    base.innerText = join(properties);
  };

form.onsubmit = (event: SubmitEvent) => {
  preventDefault(event);
  const detail = getFormValues();
  if ((event.submitter as HTMLButtonElement).value) {
    const item = combineItems(
      progress[0],
      ...doTimes(detail, (index) => inventory[index][0]),
    );
    if (item) {
      spliceTable([inventory], detail);
      inventory.push([item]);
    }
  } else {
    const toEquip = repeat(4, -1);
    doTimes(detail, (index) => toEquip[inventory[index][0][2]] = index);
    doTimes(inventory, (item, index) => {
      if (toEquip[item[0][2]] == -1) return;
      item[1] = toEquip[item[0][2]] == index;
    });
    updatePlayerSnapshots(player);
  }
  form.reset();
  resetMenu();
};

menu.oncancel = preventDefault;

menu.onmouseover = ({ target }) =>
  hoveredCellIndex = canvasCells.indexOf(target as HTMLCanvasElement);

menu.onmousemove = menu.onmouseenter = ({ clientX, clientY }: MouseEvent) => {
  const { width, height } = itemPopover.getBoundingClientRect();
  updateStyles(itemPopover, {
    top: (clientY + height > innerHeight ? clientY - height : clientY) + "px",
    left: (clientX + width > innerWidth ? clientX - width : clientX) + "px",
  });
};

export const resetMenu = () => {
  renderTargets ||= doTimes(canvasCells, createRenderTarget);
  doTimes(winCollectionElements, (element, index) =>
    winCollection.has(index) &&
    (element.style.background = "#" + GameOptions[index][1].toString(16)));
  camera([[portrait]], renderTargets[0]);
  doTimes(inventory, ([item, equipped], index) => {
    camera([[item[0]]], renderTargets[index + INVENTORY_OFFSET]);
    if (equipped) equippedItems[item[2]] = item;
  });
  doTimes(
    equippedItems,
    (item, index) => camera([[item[0]]], renderTargets[index + EQUIP_OFFSET]),
  );
};

export const updateMenu = (tickLength: number) => {
  restorePreviewSequence(inventory, tickLength);
  const [item, equipped] = inventory[hoveredCellIndex - INVENTORY_OFFSET] ??
    [equippedItems[hoveredCellIndex - EQUIP_OFFSET], true];
  if (!item) return updateStyles(itemPopover, { visibility: "hidden" });
  updateItemPopover(item);
  updateStyles(itemPopover, { visibility: "visible" });
  item[1](item, tickLength);
  camera([[item[0]]], renderTargets[hoveredCellIndex]);
  if (equipped) camera([[item[0]]], renderTargets[item[2] + EQUIP_OFFSET]);
};
