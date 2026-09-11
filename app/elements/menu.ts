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

import { createRenderTarget, GPURenderTarget } from "~/3D";
import { _, join, length, preventDefault } from "~/alias";
import { createActionSequencer } from "~/clock";
import { doTimes, repeat, spliceTable } from "~/common";
import { updateStyles } from "~/dom";

import { camera } from "../camera.ts";
import { createDeck, drawCard } from "../game/decks.ts";
import GameState from "../game/module.ts";
import GameOptions from "../game/options/module.ts";
import { PLAYER_INVENTORY_SIZE } from "../game/player/constants.ts";
import {
  combineItems,
  createItem,
  setItemInFrame,
} from "../game/player/items.ts";
import { updatePlayerEquipmentSnapshots } from "../game/player/stats.ts";
import { Item } from "../game/player/types.ts";
import { PARTS, PROPERTY_NAMES } from "../game/ship/constants.ts";
import {
  equipSound,
  restoreSound,
  winCollectionSound,
} from "../game/sounds.ts";

import {
  base,
  canvasCells,
  equipButton,
  form,
  header,
  itemPopover,
  menu,
  modifiers,
  restoreButton,
  winCollectionElements,
} from "./handles.ts";
import { portrait } from "./portrait.ts";

let hoveredCellIndex = -1,
  restorePreviewItem: Item | undefined,
  restorePreviewDeck: number[] = [],
  renderTargets: GPURenderTarget[];

const EQUIP_OFFSET = 2,
  INVENTORY_OFFSET = 6,
  [player, [, , progress, winCollection]] = GameState,
  [playerShip, equipped, inventory] = player,
  getFormValues = () => [
    doTimes(new FormData(form).getAll("i"), Number),
    doTimes(new FormData(form).getAll("l"), Number),
  ],
  restorePreviewSequence = createActionSequencer<Item[]>([
    [(inventory) => {
      const selected = getFormValues()[0];

      if (length(restorePreviewDeck) != length(selected)) {
        restorePreviewDeck = createDeck(length(selected));
      }

      restorePreviewItem = inventory[selected[drawCard(restorePreviewDeck)]];
    }],
    [(_inventory, tickLength) => {
      restorePreviewItem?.[1](restorePreviewItem, tickLength);
      camera(
        restorePreviewItem ? [[restorePreviewItem[0]]] : [],
        renderTargets[1],
      );
    }, 0.5],
  ]),
  defaultEquipItems = doTimes(
    4,
    (typeID: number) => setItemInFrame(createItem(0, typeID, 1, 1)),
  ),
  updateItemPopover = (
    [, , _typeID, _colorID, _rank, _modifiers, _baseMass, _baseWeapon]: Item,
  ) => {
    header.innerText = join([
      "⭑".repeat(_rank),
      _colorID ? GameOptions[_colorID][0] : "DEFAULT",
      PARTS[_typeID],
    ]);

    const properties = ["KG", _baseMass.toFixed(1)];
    if (_baseWeapon) {
      doTimes(
        _baseWeapon,
        (value, index) =>
          properties.push(["AMT", "RATE", "DMG"][index], value.toFixed(1)),
      );
    }
    base.innerText = join(properties);

    modifiers.innerHTML = join(
      doTimes(
        _modifiers,
        ([id, type, value]) =>
          `${type}${value.toFixed(2)} ${PROPERTY_NAMES[id]}`,
      ),
      "<br>",
    );
  };

form.onsubmit = (event: SubmitEvent) => {
  preventDefault(event);
  const [detail] = getFormValues();
  switch ((event.submitter as HTMLButtonElement).value) {
    case "2": {
      const toEquip = repeat(4, -1);
      doTimes(detail, (index) => toEquip[inventory[index][2]] = index);

      const newlyEquipped = doTimes(
        4,
        (typeID: number) =>
          toEquip[typeID] == -1 ? _ : inventory[toEquip[typeID]],
      );

      spliceTable([inventory], detail);

      let hasEquippedItem = false;
      doTimes(newlyEquipped, (item, typeID) => {
        if (!item) return;
        if (equipped[typeID]) inventory.push(equipped[typeID]!);
        equipped[typeID] = item;
        hasEquippedItem = true;
      });

      if (hasEquippedItem) equipSound();

      updatePlayerEquipmentSnapshots(player);
      break;
    }
    case "3": {
      const item = combineItems(
        progress[0] * playerShip[5][9],
        ...doTimes(detail, (index) => inventory[index]),
      );
      if (item) {
        spliceTable([inventory], detail);
        inventory.push(item);
        if (item[4] >= 2) {
          winCollection.add(item[3]);
          winCollectionSound();
          if (winCollection.size == 6) {
            alert("MISSION COMPLETED");
            location.reload();
          }
        } else restoreSound();
        updatePlayerEquipmentSnapshots(player);
      }
      break;
    }
  }
  form.reset();
  resetMenu();
};

menu.oncancel = preventDefault;

menu.onmouseover = ({ target }) =>
  hoveredCellIndex = canvasCells.indexOf(target as HTMLCanvasElement);

const CURSOR_SPACING = 20;
menu.onmouseenter = menu.onmousemove = ({ clientX, clientY }: MouseEvent) => {
  const { width, height } = itemPopover.getBoundingClientRect();

  let x = clientX + CURSOR_SPACING, y = clientY + CURSOR_SPACING;

  if (x + width > innerWidth) x = clientX - width - CURSOR_SPACING;
  if (y + height > innerHeight) y = clientY - height - CURSOR_SPACING;

  updateStyles(itemPopover, {
    top: y + "px",
    left: x + "px",
  });
};

export const resetMenu = () => {
  if (!renderTargets) renderTargets = doTimes(canvasCells, createRenderTarget);

  doTimes(
    winCollectionElements,
    (element, index) =>
      winCollection.has(index + 1) &&
      (element.style.background = "#" + GameOptions[index + 1][1].toString(16)),
  );
  camera([[portrait(GameState[1][3].size / 6)]], renderTargets[0]);

  doTimes(4, (typeID: number) => {
    const item = equipped[typeID] ?? defaultEquipItems[typeID];
    camera([[item[0]]], renderTargets[typeID + EQUIP_OFFSET]);
    canvasCells[typeID + EQUIP_OFFSET].style.opacity = equipped[typeID]
      ? "1"
      : "0.5";
  });

  doTimes(
    PLAYER_INVENTORY_SIZE,
    (index: number) =>
      camera(
        inventory[index] ? [[inventory[index][0]]] : [],
        renderTargets[index + INVENTORY_OFFSET],
      ),
  );
};

export const updateMenu = (tickLength: number) => {
  const selectedIndicies = getFormValues()[0];

  equipButton.disabled = !length(selectedIndicies);
  restoreButton.disabled = length(selectedIndicies) < 2;

  if (!restoreButton.disabled) restorePreviewSequence(inventory, tickLength);
  else camera([], renderTargets[1]);

  const selectedTypeIDs = doTimes(
    selectedIndicies,
    (index: number) => inventory[index][2],
  );
  doTimes(
    4,
    (typeID: number) =>
      canvasCells[typeID + EQUIP_OFFSET].classList.toggle(
        "selected",
        selectedTypeIDs.includes(typeID),
      ),
  );

  const inventoryItem = inventory[hoveredCellIndex - INVENTORY_OFFSET],
    equipTypeID = hoveredCellIndex - EQUIP_OFFSET,
    item = inventoryItem ?? equipped[equipTypeID] ??
      defaultEquipItems[equipTypeID];

  if (!item) return updateStyles(itemPopover, { visibility: "hidden" });
  updateItemPopover(item);
  updateStyles(itemPopover, { visibility: "visible" });
  item[1](item, tickLength);
  camera([[item[0]]], renderTargets[hoveredCellIndex]);
};
