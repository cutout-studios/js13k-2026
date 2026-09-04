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
import { doTimes } from "~/common";

export const WORDS =
  "HL SAVE DMG TAKEN TO FL AMT COST TIME RESTORE ITEM RATE LVL MIN RESOURCE M RESOLVE SLD CNTR AIM SPD STRAFE BLT CRIT SPREAD EQUIP"
    .split(" ");

export const PROPERTY_NAMES = doTimes( // TODO: AIMSPD -> AIMTIME
  "0 01 23 245 56 57 58 59 5 96 ab c6 de f g h h9 i2 ij ik lk jk m6 mn mn2 m2 m8 mb mo"
    .split(" "),
  (code: string) =>
    join(
      doTimes(Array.from(code), (char: string) => WORDS[parseInt(char, 36)]),
      "",
    ),
);

export const PARTS = ["WING (L)", "WING (R)", "BODY", "ENGINE"];
