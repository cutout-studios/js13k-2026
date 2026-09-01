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

export type Style = Partial<CSSStyleProperties>;

export const px = (value: number) => value + "px";
export const pct = (value: number) => (value * 100).toFixed(0) + "%";
export const rem = (value: number) => value + "rem";

const background = "black", color = "white";

export const PRIMARY: Style = { background, color };
export const SECONDARY: Style = { background: color, color: background };
export const CLEAR: Style = { background: "transparent" };

export const BORDER: Style = { border: rem(0.1) + " solid " + color };

export const POINTER: Style = { cursor: "pointer" };
export const HELP: Style = { cursor: "help" };

export const INERT: Style = { pointerEvents: "none" };

export const HIDDEN: Style = { visibility: "hidden" };
export const SHOWN: Style = { visibility: "visible" };

export const RELATIVE: Style = { position: "relative" };
export const ABSOLUTE: Style = { position: "absolute" };
export const FIXED: Style = { position: "fixed" };

export const OVERLAY: Style[] = [INERT, CLEAR, { position: "absolute", inset: "0" }];

const _unit = (value: number | string) => typeof value == "number" ? px(value) : value;

export const SIZING = (
	width: number | string = pct(1),
	height: number | string = width,
): Style => ({ width: _unit(width), height: _unit(height) });

export const MAX_SIZE = (
	width: number | string,
	height: number | string = width,
): Style => ({ maxWidth: _unit(width), maxHeight: _unit(height) });


export const LAYOUT = (
	columns = "auto",
	rows = "auto",
	gap = 1,
	padding = gap,
): Style => ({
	display: "grid",
	grid: `${rows} / ${columns}`,
	gap: rem(gap),
	padding: rem(padding),
	justifyItems: "center",
});

export const TILT = (sign: number): Style => ({ transform: `rotate(${15 * sign}deg)` });

export const CONTENT = (gap = 0.33): Style => ({
	display: "inline-flex",
	alignItems: "center",
	gap: rem(gap),
});

export const AT = (gridArea: string, placeSelf = "center"): Style => ({ gridArea, placeSelf });

export const DEFAULT = [PRIMARY];
