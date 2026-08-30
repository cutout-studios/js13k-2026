import { createElement } from "~/dom";
import { _ } from "~/alias";
import { FLEX_COLUMN, FLEX_ROW, INERT } from "../styles.ts";

export const title = createElement(
  "header",
  [FLEX_COLUMN, INERT],
  _,
  createElement(
    "h1",
    _,
    _,
    "MISSION: DARKWHITE",
  ),
  createElement(
    "p",
    _,
    _,
    "WHAT WAS DIVIDED YOU MUST RESTORE\n CLICK TO BEGIN",
  ),
);

export const legend = createElement(
  "footer",
  [FLEX_ROW, INERT],
  _,
  "[ESC]: EQUIP\t[WASD]: STRAFE\t[SPACE]: COUNTER\t[CLICK]: FIRE",
);
