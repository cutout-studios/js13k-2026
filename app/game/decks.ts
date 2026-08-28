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

import { floor, length, random } from "~/alias";
import { doTimes } from "~/common";

export const createDeck = (size: number) => {
  const deck: number[] = [];
  doTimes(size, (i) => insertCard(deck, i));
  return deck;
};

export const drawCard = <T>(deck: T[], delay = 0.67) => {
  const value = deck.pop()!;
  insertCard(deck, value, delay);
  return value;
};

export const insertCard = <T>(deck: T[], value: T, delay = 0) =>
  deck.splice(floor(random() * (length(deck) * (1 - delay) + 1)), 0, value);
