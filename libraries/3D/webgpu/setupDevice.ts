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

export let device: GPUDevice,
  format: GPUTextureFormat,
  coordinatesLayout: GPUBindGroupLayout,
  materialsLayout: GPUBindGroupLayout,
  pipelineLayout: GPUPipelineLayout;

export const setupDevice = async () => {
  const gpu = navigator.gpu;
  const adapter = await gpu?.requestAdapter();
  const found = await adapter?.requestDevice();

  if (!found) return;

  device = found;
  format = gpu.getPreferredCanvasFormat();

  coordinatesLayout = device.createBindGroupLayout({
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.VERTEX,
      buffer: { type: "uniform" },
    }],
  });

  materialsLayout = device.createBindGroupLayout({
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    }],
  });

  pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [coordinatesLayout, materialsLayout],
  });

  // device.addEventListener(
  //   "uncapturederror",
  //   ({ error }) => console.error(error.message),
  // );
};
