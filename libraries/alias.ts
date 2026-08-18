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

export const {
  random,
  round,
  floor,
  min,
  max,
  atan,
  atan2,
  PI,
  sin,
  cos,
  tan,
  hypot,
} = Math;

export const length = <T>(array: Array<T>) => array.length;
// export const push = <T>(array: Array<T>, ...items: T[]) => array.push(...items);
// export const map = <T, K>(array: T[], mapper: (item: T) => K) => array.map(mapper);

const d = globalThis.document;

export const createElement = (tagName: string) => d.createElement(tagName);
export const appendChild = (child: Element, parent = d.body) =>
  parent.appendChild(child);

export const F32 = Float32Array;

export const style = (node: HTMLElement, object: Record<string, string>) => {
  for (const key in object) node.style[key as never] = object[key];
};
