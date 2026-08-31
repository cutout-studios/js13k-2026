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

const background = "black", color = "white";

export const rem = (value: number) => value + "rem";
export const px = (value: number) => value + "px";
export const percent = (value: number) => value + "%";

export const FULL_PERCENT = percent(100);
export const HALF_PERCENT = percent(50);

export const PRIMARY: Partial<CSSStyleProperties> = {
  background,
  color,
  borderColor: color,
};

export const SECONDARY: Partial<CSSStyleProperties> = {
  background: color,
  color: background,
};

export const BORDER: Partial<CSSStyleProperties> = { borderWidth: px(2) };
export const POINTER: Partial<CSSStyleProperties> = { cursor: "pointer" };
export const INERT: Partial<CSSStyleProperties> = { pointerEvents: "none" };
export const HIDDEN: Partial<CSSStyleProperties> = { visibility: "hidden" };

export const OVERLAY: Partial<CSSStyleProperties>[] = [INERT, {
  position: "absolute",
  inset: "0",
}];

export const DEFAULT = (): Partial<CSSStyleProperties>[] => [FLEX(), PRIMARY];

export const FLEX = (
  flexDirection = "row",
  gap = rem(0.33),
): Partial<CSSStyleProperties> => ({
  alignItems: "center",
  display: "flex",
  flex: "1",
  flexDirection,
  gap,
  justifyContent: "center",
  padding: rem(1),
});

export const SQUARE = (
  side: string = FULL_PERCENT,
  prefix = "",
): Partial<CSSStyleProperties> => ({
  [prefix + (prefix ? "W" : "w") + "idth"]: side,
  [prefix + (prefix ? "H" : "h") + "eight"]: side,
});

export const TILT = (sign: number): Partial<CSSStyleProperties> => ({
  transform: `rotate(${15 * sign}deg)`,
});
