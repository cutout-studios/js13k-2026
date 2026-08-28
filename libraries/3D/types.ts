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

export type XYZ = [x: number, y: number, z: number];
export type RGBA = [r: number, g: number, b: number, a: number];
export type AxisAngle = [axis: XYZ, angle: number];

export type XOOrientation = [position?: XYZ, rotation?: AxisAngle];

export type XOGeometry = [radius: number, verticies: XYZ[]];
export type XOMaterial = [code: string, data: Float32Array];
export type XOObject = [
  coordinates: Float32Array,
  geometry: XOGeometry,
  material?: XOMaterial,
];

export type GPUDataContainer = [buffer: GPUBuffer, bindGroup: GPUBindGroup];

export type GPURenderTarget = [
  aspectRatio: number,
  descriptor: GPURenderPassDescriptor,
  (process: (encoder: GPURenderPassEncoder) => void) => void,
];
