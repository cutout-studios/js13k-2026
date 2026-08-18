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

import { PI, tan } from "~alias";
import { FLOAT_32_BIN, FLOAT_32_BYTES } from "~common";

export const XYZ_LENGTH = 3;

export const COORDINATES_DATA_GROUP_ID = 0;
export const COORDINATE_SIDE_LENGTH = 4;
export const COORDINATE_DATA_LENGTH = COORDINATE_SIDE_LENGTH ** 2;
export const COORDINATE_DATA_SIZE = COORDINATE_DATA_LENGTH * FLOAT_32_BYTES;

export const VERTEX_DATA_SIZE = XYZ_LENGTH * FLOAT_32_BYTES;
export const VERTEX_DATA_FORMAT: GPUVertexFormat =
  `float${FLOAT_32_BIN}x${XYZ_LENGTH}`;

export const DEPTH_TEXTURE_FORMAT = "depth24plus";

export const MATERIALS_DATA_GROUP_ID = 1;

// ratio of half-screen height to viewing distance. FOV is implicit
export const CAMERA_MAGNIFICATION_RATIO = tan(3 * PI / 8);
export const CAMERA_DEFAULT_SAFETY_CROP = 0.1;
