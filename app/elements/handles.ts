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

/// <reference lib="dom" />
import { arrayFrom } from "~/alias";

const _ = self as never as Record<
  string,
  HTMLElement & HTMLCanvasElement & HTMLDialogElement & HTMLFormElement
>;

export const {
  a: header,
  b: modifiers,
  c: mainCanvas,
  d: distanceCounter,
  f: fuelMeter,
  k: base,
  m: menu,
  o: form,
  p: itemPopover,
  r: armorMeter,
  s: shieldMeter,
  t: title,
  w: waveCounter,
} = _;

export const canvasCells = arrayFrom(
  document.querySelectorAll<HTMLCanvasElement>("#o canvas"),
);

export const winCollectionElements = arrayFrom(
  document.querySelectorAll<HTMLElement>("#y i"),
);
