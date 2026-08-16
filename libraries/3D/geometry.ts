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

import type { XOGeometry, XYZ } from "./types.ts";

export const createTriangle = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
): XOGeometry => [p1, p2, p3];

export const createSquare = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
  p4: XYZ,
): XOGeometry => [...createTriangle(p1, p2, p3), ...createTriangle(p1, p3, p4)];
