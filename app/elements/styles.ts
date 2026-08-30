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

const rem = (value: number) => `${value}rem`,
  background = "black",
  color = "white";

export const SQUARE = (
  side: string | number = "100%",
  height = side,
): Partial<CSSStyleProperties> => ({
  width: String(side),
  height: String(height),
});

export const PRIMARY: Partial<CSSStyleProperties> = {
  background,
  color,
  borderColor: color,
};
export const SECONDARY: Partial<CSSStyleProperties> = {
  background: color,
  color: background,
};

export const POINTER: Partial<CSSStyleProperties> = { cursor: "pointer" };

export const INERT: Partial<CSSStyleProperties> = { pointerEvents: "none" };
export const HIDDEN: Partial<CSSStyleProperties> = { visibility: "hidden" };

export const CANTED = (amount = 15): Partial<CSSStyleProperties> => ({
  transform: `rotate(${amount})`,
});

export const CORNER = (
  top: number | string = 0,
  left: number | string = 0,
): Partial<CSSStyleProperties> => ({
  position: "absolute",
  top: String(top),
  left: String(left),
});

export const BORDER: Partial<CSSStyleProperties> = { border: "2px solid" };

export const FLEX = (dir = "row", gap = 0.33): Partial<CSSStyleProperties> => ({
  display: "flex",
  padding: rem(1),
  flexDirection: dir,
  alignItems: "center",
  justifyContent: "center",
  flex: "1",
  gap: String(gap),
});

export const OVERLAY: Partial<CSSStyleProperties>[] = [INERT, {
  position: "absolute",
  inset: "0",
}];

export const DEFAULT = (): Partial<CSSStyleProperties>[] => [FLEX(), PRIMARY];
