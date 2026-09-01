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
  PI,
  sin,
  sqrt,
  cos,
  tan,
  hypot,
} = Math;
export const { addEventListener } = document;

export const TAU = PI * 2;
export const F32 = Float32Array;
export const NO_OP = () => {};
export const _ = undefined;

export const length = (array: unknown[] | Float32Array | string) =>
  array.length;
export const join = (array: (string | number)[], delimiter: string = " ") =>
  array.join(delimiter);
export const arrayFrom = <T>(iterable: Iterable<T>) => Array.from(iterable);

export const preventDefault = (event: Event) => event.preventDefault();
