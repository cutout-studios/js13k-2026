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

import { _ } from "~/alias";
import { doTimes, repeat } from "~/common";
import { createElement } from "~/dom";

import {
  BACKGROUND,
  BORDER,
  FLEX_CENTER,
  FLEX_ROW,
  HIDDEN,
  INERT,
} from "../../styles.ts";
import { PROPERTY_NAMES } from "../../game/ship/constants.ts";
import { Item } from "../../game/player/types.ts";

const header = createElement("header", [FLEX_ROW, FLEX_CENTER, {
    padding: ".33rem",
    background: "white",
    color: "black",
  }]),
  modifiers = createElement("div"),
  base = createElement("aside", [BACKGROUND, BORDER(), {
    padding: ".33rem",
  }]);

export const itemPopover = createElement(
  "div",
  [BORDER(2), HIDDEN, INERT, {
    position: "fixed",
    ["max-width"]: "fit-content",
  }],
  _,
  header,
  createElement(
    "section",
    [BACKGROUND, FLEX_ROW, FLEX_CENTER, {
      padding: ".5rem",
      gap: ".7rem",
    }],
    _,
    modifiers,
    base,
  ),
);

export const updateItemPopover = (
  [, , _typeID, _rank, _modifiers, _baseMass, _baseWeapon]: Item,
) => { // TODO: Color Name
  header.innerText = `${repeat(_rank, "⭑").join("")} ${
    ["WING (L)", "WING (R)", "BODY", "ENGINE"][_typeID]
  }`;

  modifiers.innerText = doTimes(
    _modifiers,
    ([id, type, value]) => `${type}${value.toFixed(2)} ${PROPERTY_NAMES[id]}`,
  ).join("\n");

  base.textContent = `M: ${_baseMass}`;

  if (_baseWeapon) {
    base.textContent += doTimes(
      _baseWeapon,
      (value, index) => `${["C", "R", "D"][index]}: ${value}`,
    ).join("\n");
  }
};
