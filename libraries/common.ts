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

import { arrayFrom, max } from "~/alias";

export const SECONDS_TO_MS = 1000;
export const MINUTES_TO_SECONDS = 60;

export const BYTES_TO_BIN = 8;
export const FLOAT_32_BIN = 32;
export const FLOAT_32_BYTES = FLOAT_32_BIN / BYTES_TO_BIN;

type AnyEnumerable<T> = Iterable<T> | Record<string | number, T>;
type IterableRecord<T> = Iterable<T> & Record<string | number, T>;

export const doTimes = <T, K>(
  enumerator: number | Array<K>,
  action: (element: K, index: number) => T,
): T[] =>
  (typeof enumerator == "number"
    ? arrayFrom(Array(max(0, enumerator)).keys())
    : enumerator)
    .map(action as (element: K | number, index: number) => T);

export const flat = <T>(
  ...enumerables: AnyEnumerable<T>[]
): T[] => {
  const result = [] as unknown as IterableRecord<T>;

  let index = 0;
  doTimes(enumerables, (enumerable) => {
    if (!enumerable) return;
    doTimes(
      Object.entries(
        (enumerable as Iterable<T>)[Symbol.iterator]
          ? arrayFrom(enumerable as Iterable<T>)
          : enumerable,
      ),
      ([key, value]) => {
        if (isNaN(+key)) return result[key] = value;
        result[index] = value;
        index++;
      },
    );
  });

  return result as unknown as T[];
};

export const flatDoTimes = <T extends AnyEnumerable<J>, K, J>(
  enumerator: Array<K>,
  action: (element: K, index: number) => T,
) => flat(...doTimes<T, K>(enumerator, action));

export const repeat = <T>(times: number, thing: T): T[] =>
  doTimes(times, () => thing);

export const memo = <Key extends WeakKey, Value>(
  create: (key: Key) => Value,
) => {
  const cache = new WeakMap<Key, Value>();

  return (key: Key) => {
    let value = cache.get(key);

    if (!value) cache.set(key, value = create(key));

    return value;
  };
};

export const spliceTable = (
  table: unknown[][],
  rowIndicies: number[],
) =>
  doTimes(
    flat(new Set(rowIndicies)).sort((a, b) => b - a),
    (index: number) => {
      doTimes(table, (column: unknown[]) => column.splice(index, 1));
    },
  );
