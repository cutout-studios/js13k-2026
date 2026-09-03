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

import { doTimes } from "~/common";

const keys = new Set<string>();
onkeydown = ({ code }) => keys.add(code);
onkeyup = ({ code }) => keys.delete(code);
onblur = () => keys.clear();
oncontextmenu = () => false;

onpointerdown =
  onpointerup =
    ({ buttons }) =>
      doTimes(
        ["LClick", "RClick"],
        (code: string, index: number) =>
          keys[buttons & (1 << index) ? "add" : "delete"](code),
      );

export const bindButton = (
  code: string,
  onDown?: (tickLength: number) => void,
  onHold?: (tickLength: number) => void,
  onUp?: (tickLength: number) => void,
  onFree?: (tickLength: number) => void,
) => {
  let wasDown = keys.has(code);

  return (tickLength: number) => {
    const isDown = keys.has(code);

    if (wasDown && !isDown) onDown?.(tickLength);
    if (wasDown && isDown) onHold?.(tickLength);
    if (!wasDown && isDown) onUp?.(tickLength);
    if (!wasDown && !isDown) onFree?.(tickLength);

    wasDown = isDown;
  };
};

let pointerX: number, pointerY: number;
onpointermove = (
  { clientX, clientY },
) => (pointerX = clientX, pointerY = clientY);

export const bindPointer = (
  onTick: (tickLength: number, x: number, y: number) => void,
) =>
(tickLength: number) => onTick(tickLength, pointerX, pointerY);
