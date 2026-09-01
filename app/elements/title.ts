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
import { createElement, createTextNode } from "~/dom";

import { WORDS } from "../game/ship/constants.ts";

import { OVERLAY } from "./styles.ts";

export const title = createElement(
  OVERLAY,
  createTextNode(
    join([
      "MISSION: DARKWHITE",
      `WHAT WAS DIVIDED YOU MUST ${WORDS[9]}`,
      "CLICK TO BEGIN",
    ], "\n"),
  ),
);

export const legend = createElement(
  OVERLAY,
  createTextNode(
    join([
      `[ESC]: ${WORDS[25]}`,
      `[WASD]: ${WORDS[21]}`,
      `[SPACE]: ${WORDS[18]}`,
      `[CLICK]: ${WORDS[22]}`,
    ], "\t"),
  ),
);
