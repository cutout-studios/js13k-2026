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

export const BACKGROUND = { background: "black" };

export const POINTER = { cursor: "pointer" };

export const FULL_SIZE = { width: "100%", height: "100%" };

export const BLOCK = { display: "block", position: "relative" };

export const HIDDEN = { visibility: "hidden" };

// TODO: separate "rotate" and "corner"
export const CORNER = (right?: boolean, top?: boolean, inset = 2.5) => ({
  transform: `rotate(${right ? 15 : -15}deg)`,
  position: "relative",
  [top ? "top" : "bottom"]: `${inset}rem`,
});

export const BORDER = (width = 1) => ({ border: `${width}px solid white` });

export const PADDED = { padding: "1rem" };

export const FLEX_ROW = {
  display: "flex",
  gap: ".33rem",
};

export const FLEX_CENTER = {
  ["justify-content"]: "center",
  ["align-items"]: "center",
};

export const JUSTIFY = (spacing = "around") => ({
  ["justify-content"]: `space-${spacing}`,
});

export const FLEX_COLUMN = {
  ...FLEX_ROW,
  ["flex-direction"]: "column",
};

export const PADDED_FLEX_ROW = { ...FLEX_ROW, ...PADDED };
