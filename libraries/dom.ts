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

import { document } from "~/alias";

export const createElement = (
  tag: string,
  style: object = {},
  attributes: object = {},
  ...children: Array<HTMLElement | string>
) => {
  const element = document.createElement(tag);
  Object.assign(element, {
    ...attributes,
    style: Object.entries(style).reduce(
      (result, [key, value]) => result + `${key}:${value};`,
      "",
    ),
  });
  element.append(...children.flat());
  return element;
};
