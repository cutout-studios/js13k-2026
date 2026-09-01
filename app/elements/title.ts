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
import { createElement, createTextNode } from "~/dom";

import { WORDS } from "../game/ship/constants.ts";
import { ABSOLUTE, INERT, LAYOUT } from "./styles.ts";

export const title = createElement(
  [INERT, ABSOLUTE, LAYOUT(["auto"], repeat(3, "min-content")), {
    inset: "auto 0 0 0",
    height: "45svh",
    alignContent: "center",
    background: "linear-gradient(transparent,black 45%)",
    transition: "opacity 240ms",
  }],
  ...doTimes([
    "MISSION: DARKWHITE",
    `WHAT WAS DIVIDED YOU MUST ${WORDS[9]}`,
    "CLICK TO BEGIN",
  ], (text) => createElement(createTextNode(text))),
);

export const hideTitle = () => {
  title.style.opacity = "0";
  title.ontransitionend = () => title.remove();
};
