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

import { join } from "~/alias";
import { doTimes, repeat } from "~/common";
import { createElement } from "~/dom";
import GameOptions from "../../game/options/module.ts";
import { Item } from "../../game/player/types.ts";
import { PARTS, PROPERTY_NAMES, WORDS } from "../../game/ship/constants.ts";
import {
  BORDER,
  FIXED,
  HIDDEN,
  INERT,
  LAYOUT,
  MAX_SIZE,
  rem,
  SECONDARY,
} from "../styles.ts";

const padding = { padding: rem(0.3) },
  header = createElement([SECONDARY, padding, { textAlign: "center" }]),
  modifiers = createElement([{ textAlign: "center" }]),
  base = createElement([BORDER, padding]);

export const itemPopover = createElement(
  [BORDER, HIDDEN, INERT, FIXED, MAX_SIZE("fit-content", "none"), {
    display: "grid",
    justifyItems: "stretch",
  }],
  header,
  createElement(
    [LAYOUT(["auto"], repeat(2, "auto"), 0.5)],
    modifiers,
    base,
  ),
);

export const updateItemPopover = (
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
      ([id, type, value]) => `${type}${value.toFixed(2)} ${PROPERTY_NAMES[id]}`,
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
