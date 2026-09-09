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

import {
  encode,
  GRID,
  TRIANGLE_BANDS,
  VERTICES,
} from "../../scripts/encodePortrait.ts";

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

// which of the 6 bands each triangle uses - loaded from the persisted
// TRIANGLE_BANDS (see scripts/encodePortrait.ts) so assignments survive a
// reload. only falls back to a guess (round-robin) for triangles added here
// that haven't been exported with "Copy triangle bands" yet
const triangleBand = Array.from(
  { length: triangleCount() },
  (_, index) => TRIANGLE_BANDS[index] ?? index % BANDS.length,
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

const sideOf = (
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) => (px - bx) * (ay - by) - (ax - bx) * (py - by);

// last match wins - triangles drawn later are on top, matching what you see
const findTriangleAt = (x: number, y: number): number | null => {
  let found: number | null = null;

  doTimes(triangleCount(), (triangleIndex: number) => {
    const base = triangleIndex * 6,
      [ax, ay] = toCanvas(vertices[base], vertices[base + 1]),
      [bx, by] = toCanvas(vertices[base + 2], vertices[base + 3]),
      [cx, cy] = toCanvas(vertices[base + 4], vertices[base + 5]),
      d1 = sideOf(x, y, ax, ay, bx, by),
      d2 = sideOf(x, y, bx, by, cx, cy),
      d3 = sideOf(x, y, cx, cy, ax, ay),
      hasNeg = d1 < 0 || d2 < 0 || d3 < 0,
      hasPos = d1 > 0 || d2 > 0 || d3 > 0;

    if (!(hasNeg && hasPos)) found = triangleIndex;
  });

  return found;
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

// the shader indexes the color palette by triangle position, so colors can
// only be run-length-encoded into repeat() blocks if same-band triangles are
// actually adjacent in the vertex array - this reorders both together
// (stable within each band) so copyColors and copyVertices agree
const sortTrianglesByBand = () => {
  const order = Array.from({ length: triangleCount() }, (_, index) => index)
    .sort((a, b) => triangleBand[a] - triangleBand[b]);

  const newVertices: number[] = [], newBands: number[] = [];
  doTimes(order, (triangleIndex: number) => {
    newVertices.push(...vertices.slice(triangleIndex * 6, triangleIndex * 6 + 6));
    newBands.push(triangleBand[triangleIndex]);
  });

  vertices.splice(0, vertices.length, ...newVertices);
  triangleBand.splice(0, triangleBand.length, ...newBands);
  selectVertex(null);
  draw();
};

canvas.onmousedown = (event) => {
  const foundVertex = findVertexNear(event.offsetX, event.offsetY);

  if (foundVertex != null) {
    selectVertex(foundVertex);
    dragging = true;
  } else {
    const foundTriangle = findTriangleAt(event.offsetX, event.offsetY);
    selectVertex(foundTriangle != null ? foundTriangle * 3 : null);
    dragging = false;
  }

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
document.getElementById("sortByBand")!.onclick = sortTrianglesByBand;

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

// paste this into scripts/encodePortrait.ts's TRIANGLE_BANDS every time you
// change a band assignment here - otherwise it's lost on reload (see
// triangleBand's initializer above)
document.getElementById("copyBands")!.onclick = () =>
  showOutput(`[\n  ${triangleBand.join(", ")},\n]`);

// run-length-encodes the current per-triangle band assignment into the same
// repeat(count, toRGB(...)) shape app/elements/portrait.ts already uses -
// stays correct after adding/deleting/reassigning triangles here
document.getElementById("copyColors")!.onclick = () => {
  const runs: [band: number, count: number][] = [];

  doTimes(triangleCount(), (triangleIndex: number) => {
    const band = triangleBand[triangleIndex],
      last = runs[runs.length - 1];

    if (last && last[0] == band) last[1]++;
    else runs.push([band, 1]);
  });

  const calls = runs
    .map(([band, count]) => {
      const [hue, satMax, lightness] = BANDS[band];
      return `    repeat(${count}, toRGB(${hue}, interpolate([0, ${satMax}], progress), ${lightness})),`;
    })
    .join("\n");

  showOutput(`paint(\n  ...flat(\n${calls}\n  ),\n)`);
};

draw();
