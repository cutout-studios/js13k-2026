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

export const { document } = globalThis;
export const {
  abs,
  random,
  round,
  floor,
  min,
  max,
  atan,
  atan2,
  E,
  PI,
  sin,
  sqrt,
  cos,
  tan,
  hypot,
} = Math;

export const TAU = PI * 2;
export const F32 = Float32Array;

export const length = (array: Array<unknown> | Float32Array | string) =>
  array.length;

export const _ = undefined;
export const NO_OP = () => {};
export const preventDefault = (event: Event) => event.preventDefault();
