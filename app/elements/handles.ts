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
import { arrayFrom, document } from "~/alias";

const $ = (id: string) => document.getElementById(id)!;

export const mainCanvas = $("c") as HTMLCanvasElement,
  fuelMeter = $("f"),
  shieldMeter = $("s"),
  armorMeter = $("r"),
  distanceCounter = $("d"),
  waveCounter = $("w"),
  menu = $("m") as HTMLDialogElement,
  form = $("o") as HTMLFormElement,
  itemPopover = $("p"),
  title = $("t"),
  header = $("a"),
  modifiers = $("b"),
  base = $("k");

export const canvasCells = arrayFrom(
  document.querySelectorAll<HTMLCanvasElement>("#o canvas"),
);

export const winCollectionElements = arrayFrom(
  document.querySelectorAll<HTMLElement>("#y i"),
);
