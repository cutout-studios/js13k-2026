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

/// <reference lib="dom" />

import { toRGB } from "~/3D";
import { doTimes, interpolate } from "~/common";

import { encode, GRID, VERTICES } from "../../scripts/encodePortrait.ts";

const CANVAS_SIZE = 512,
  SCALE = CANVAS_SIZE / (2 * GRID),
  VERTEX_PICK_RADIUS = 8,
  SNAP_RADIUS = 10,
  NEW_TRIANGLE_SPAN = 6;

// [hue, saturation max, lightness] - mirrors app/elements/portrait.ts's 6
// color bands. cycling by triangle index (instead of the original's fixed
// per-band triangle counts) means this stays correct no matter how many
// triangles get added/removed here
const BANDS = [
  [270, 20, 8],
  [220, 60, 93],
  [265, 18, 63],
  [270, 12, 45],
  [217, 27, 65],
  [217, 18, 43],
];

const colorAt = (triangleIndex: number, progress: number): string => {
  const [hue, satMax, lightness] = BANDS[triangleBand[triangleIndex]],
    packed = toRGB(hue, interpolate([0, satMax], progress), lightness);

  return "#" + ((packed >>> 8) & 0xFFFFFF).toString(16).padStart(6, "0");
};

const vertices = [...VERTICES];

const vertexCount = () => vertices.length / 2;
const triangleCount = () => vertexCount() / 3;

// which of the 6 bands each triangle uses. the original 40 triangles are
// grouped in contiguous blocks per band (matching the shipped counts in
// app/elements/portrait.ts exactly); anything beyond that (added here)
// just cycles through the bands
const ORIGINAL_BAND_COUNTS = [5, 9, 8, 9, 4, 5];

const initialBandFor = (triangleIndex: number): number => {
  let remaining = triangleIndex;

  for (let band = 0; band < ORIGINAL_BAND_COUNTS.length; band++) {
    if (remaining < ORIGINAL_BAND_COUNTS[band]) return band;
    remaining -= ORIGINAL_BAND_COUNTS[band];
  }

  return triangleIndex % BANDS.length;
};

const triangleBand = Array.from(
  { length: triangleCount() },
  (_, index) => initialBandFor(index),
);

const toCanvas = (x: number, y: number): [number, number] => [
  CANVAS_SIZE / 2 + x * SCALE,
  CANVAS_SIZE / 2 - y * SCALE,
];

const fromCanvas = (x: number, y: number): [number, number] => [
  (x - CANVAS_SIZE / 2) / SCALE,
  (CANVAS_SIZE / 2 - y) / SCALE,
];

const canvas = document.getElementById("canvas") as HTMLCanvasElement,
  context = canvas.getContext("2d")!,
  progressInput = document.getElementById("progress") as HTMLInputElement,
  snapToggle = document.getElementById("snap") as HTMLInputElement,
  bandSelect = document.getElementById("band") as HTMLSelectElement,
  selectedLabel = document.getElementById("selected")!,
  vertexXInput = document.getElementById("vertexX") as HTMLInputElement,
  vertexYInput = document.getElementById("vertexY") as HTMLInputElement,
  outputArea = document.getElementById("output") as HTMLTextAreaElement;

let selectedVertex: number | null = null,
  dragging = false,
  snapHoverTarget: number | null = null;

const draw = () => {
  const progress = +progressInput.value;

  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  doTimes(triangleCount(), (triangleIndex: number) => {
    const base = triangleIndex * 6;

    context.beginPath();
    doTimes(3, (cornerIndex: number) => {
      const [x, y] = toCanvas(
        vertices[base + cornerIndex * 2],
        vertices[base + cornerIndex * 2 + 1],
      );

      cornerIndex ? context.lineTo(x, y) : context.moveTo(x, y);
    });
    context.closePath();
    context.fillStyle = colorAt(triangleIndex, progress);
    context.fill();
    context.strokeStyle = "#000a";
    context.stroke();
  });

  doTimes(vertexCount(), (vertexIndex: number) => {
    const [x, y] = toCanvas(
      vertices[vertexIndex * 2],
      vertices[vertexIndex * 2 + 1],
    );

    context.beginPath();
    context.arc(
      x,
      y,
      vertexIndex == selectedVertex
        ? 5
        : vertexIndex == snapHoverTarget
        ? 6
        : 3,
      0,
      Math.PI * 2,
    );
    context.fillStyle = vertexIndex == selectedVertex
      ? "#ff0"
      : vertexIndex == snapHoverTarget
      ? "#f0f"
      : "#0ff";
    context.fill();
  });
};

const findVertexNear = (
  x: number,
  y: number,
  exclude: number | null = null,
  radius = VERTEX_PICK_RADIUS,
): number | null => {
  let closestIndex: number | null = null, closestDistance = radius;

  doTimes(vertexCount(), (vertexIndex: number) => {
    if (vertexIndex == exclude) return;

    const [vx, vy] = toCanvas(
      vertices[vertexIndex * 2],
      vertices[vertexIndex * 2 + 1],
    );
    const distance = Math.hypot(vx - x, vy - y);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = vertexIndex;
    }
  });

  return closestIndex;
};

const selectVertex = (vertexIndex: number | null) => {
  selectedVertex = vertexIndex;

  if (vertexIndex == null) {
    selectedLabel.textContent = "none - click a point";
    vertexXInput.value = vertexYInput.value = "";
    return;
  }

  const triangleIndex = Math.floor(vertexIndex / 3);

  selectedLabel.textContent =
    `vertex ${vertexIndex} (triangle ${triangleIndex})`;
  vertexXInput.value = vertices[vertexIndex * 2].toString();
  vertexYInput.value = vertices[vertexIndex * 2 + 1].toString();
  bandSelect.value = triangleBand[triangleIndex].toString();
};

const deleteSelectedTriangle = () => {
  if (selectedVertex == null) return;

  const triangleIndex = Math.floor(selectedVertex / 3);

  vertices.splice(triangleIndex * 6, 6);
  triangleBand.splice(triangleIndex, 1);
  selectVertex(null);
  draw();
};

const addTriangle = () => {
  vertices.push(
    0,
    NEW_TRIANGLE_SPAN,
    NEW_TRIANGLE_SPAN,
    -NEW_TRIANGLE_SPAN,
    -NEW_TRIANGLE_SPAN,
    -NEW_TRIANGLE_SPAN,
  );
  triangleBand.push(triangleBand.length % BANDS.length);
  selectVertex(vertexCount() - 3);
  draw();
};

canvas.onmousedown = (event) => {
  const found = findVertexNear(event.offsetX, event.offsetY);

  selectVertex(found);
  dragging = found != null;
  draw();
};

document.onmousemove = (event) => {
  if (!dragging || selectedVertex == null) return;

  const rect = canvas.getBoundingClientRect(),
    canvasX = event.clientX - rect.left,
    canvasY = event.clientY - rect.top;

  snapHoverTarget = snapToggle.checked
    ? findVertexNear(canvasX, canvasY, selectedVertex, SNAP_RADIUS)
    : null;

  const [x, y] = snapHoverTarget != null
    ? [vertices[snapHoverTarget * 2], vertices[snapHoverTarget * 2 + 1]]
    : fromCanvas(canvasX, canvasY).map(Math.round);

  vertices[selectedVertex * 2] = x;
  vertices[selectedVertex * 2 + 1] = y;
  vertexXInput.value = x.toString();
  vertexYInput.value = y.toString();
  draw();
};

document.onmouseup = () => {
  dragging = false;
  snapHoverTarget = null;
  draw();
};

document.onkeydown = (event) => {
  if (
    (event.key != "Delete" && event.key != "Backspace") ||
    selectedVertex == null ||
    document.activeElement == vertexXInput ||
    document.activeElement == vertexYInput
  ) return;

  deleteSelectedTriangle();
};

const applyNumberInput = () => {
  if (selectedVertex == null) return;

  vertices[selectedVertex * 2] = +vertexXInput.value || 0;
  vertices[selectedVertex * 2 + 1] = +vertexYInput.value || 0;
  draw();
};

vertexXInput.oninput = applyNumberInput;
vertexYInput.oninput = applyNumberInput;
progressInput.oninput = draw;
bandSelect.onchange = () => {
  if (selectedVertex == null) return;

  triangleBand[Math.floor(selectedVertex / 3)] = +bandSelect.value;
  draw();
};
document.getElementById("addTriangle")!.onclick = addTriangle;
document.getElementById("deleteTriangle")!.onclick = deleteSelectedTriangle;

const showOutput = (text: string) => {
  outputArea.value = text;
  navigator.clipboard?.writeText(text).catch(() => {});
};

document.getElementById("copyVertices")!.onclick = () =>
  showOutput(`[\n  ${vertices.join(",\n  ")},\n]`);

document.getElementById("copyEncoded")!.onclick = () => {
  const encoded = encode(vertices);

  showOutput(`${JSON.stringify(encoded)} // ${encoded.length} chars`);
};

draw();
