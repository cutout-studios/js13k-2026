import { _ } from "~/alias";
import { createElement, createTextNode } from "~/dom";
import { WORDS } from "../game/ship/constants.ts";
import { FLEX, OVERLAY } from "./styles.ts";

export const title = createElement(
  [FLEX("column"), ...OVERLAY],
  createTextNode(
    `MISSION: DARKWHITE\nWHAT WAS DIVIDED YOU MUST ${
      WORDS[9]
    }\n CLICK TO BEGIN`,
  ),
);

export const legend = createElement(
  OVERLAY,
  createTextNode(
    `[ESC]: ${WORDS[25]}\t[WASD]: ${WORDS[21]}\t[SPACE]: ${
      WORDS[18]
    }\t[CLICK]: ${WORDS[22]}`,
  ),
);
