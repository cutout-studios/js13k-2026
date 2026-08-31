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

import { _, join } from "~/alias";
import { doTimes } from "~/common";
import { createElement } from "~/dom";

import { Item } from "../../game/player/types.ts";
import { PARTS, PROPERTY_NAMES, WORDS } from "../../game/ship/constants.ts";

import { BORDER, HIDDEN, INERT, rem, SECONDARY, SQUARE } from "../styles.ts";

const header = createElement([SECONDARY]),
  modifiers = createElement(),
  base = createElement([BORDER]);

export const itemPopover = createElement(
  [BORDER, HIDDEN, INERT, SQUARE("fit-content", "max"), {
    position: "fixed",
  }],
  header,
  createElement(
    [{
      padding: rem(0.5),
      gap: rem(0.7),
    }],
    modifiers,
    base,
  ),
);

export const updateItemPopover = (
  [, , _typeID, _name, _rank, _modifiers, _baseMass, _baseWeapon]: Item,
) => {
  header.innerText = join(["⭑".repeat(_rank), _name, PARTS[_typeID]], " ");

  modifiers.innerText = join(
    doTimes(
      _modifiers,
      ([id, type, value]) => `${type}${value.toFixed(2)} ${PROPERTY_NAMES[id]}`,
    ),
    "\n",
  );

  const properties = [WORDS[15], _baseMass];

  if (_baseWeapon) {
    doTimes(
      _baseWeapon,
      (value, index) =>
        properties.push([WORDS[6], WORDS[11], WORDS[2]][index], value),
    );
  }

  base.innerText = join(properties, " ");
};
