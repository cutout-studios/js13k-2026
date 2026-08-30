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
import { doTimes } from "~/common";
import { DEFAULT } from "../app/elements/styles.ts";

export const createElement = (
  ...parameters:
    (string | Partial<CSSStyleProperties>[] | Record<string, unknown> | Node)[]
) => {
  const children = [] as Node[];

  let tag = "div", styles = DEFAULT(), attributes = {};
  doTimes(parameters, (param) => {
    if (typeof param === "string") return tag = param;
    if (param instanceof Node) return children.push(param);
    if (Array.isArray(param)) {
      return styles = [...styles, ...param] as CSSStyleProperties[];
    }

    attributes = { ...attributes, ...param };
  });

  const element = document.createElement(tag);
  Object.assign(element, attributes);
  Object.assign(element.style, ...styles);
  element.append(...children);

  return element;
};

export const createTextNode = (text: string): Node =>
  document.createTextNode(text);
