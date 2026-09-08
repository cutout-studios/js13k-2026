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

import {
  createPulseBuffer,
  createRingBuffer,
  createSound,
  NOISE_BUFFER,
  SAWTOOTH_BUFFER,
  SINE_BUFFER,
  SQUARE_BUFFER,
  TRIANGLE_BUFFER,
} from "~/audio";
import { doTimes } from "~/common";

import * as sounds from "../../app/game/sounds.ts";
import type { Sound, SoundDefinition } from "../../libraries/audio/types.ts";

// -- soundboard: every sound already exported from game/sounds.ts. clicking
// one plays it (as before) and also loads it into the editor below --

const soundButtons = document.getElementById("soundButtons")!;

doTimes(Object.entries(sounds), ([name, play]: [string, Sound]) => {
  const button = document.createElement("button");

  button.textContent = name;
  button.onclick = () => {
    play();
    loadDefinitions(play.definitions);
  };
  soundButtons.appendChild(button);
});

// -- editor: build a sound from scratch (or load one from the soundboard),
// preview it, export the code --

const BUFFERS: Record<string, AudioBuffer> = {
  SINE_BUFFER,
  SQUARE_BUFFER,
  TRIANGLE_BUFFER,
  SAWTOOTH_BUFFER,
  NOISE_BUFFER,
};
const BUFFER_NAME_BY_INSTANCE = new Map(
  Object.entries(BUFFERS).map(([name, buffer]) => [buffer, name]),
);

const PULSE_NAME = "PULSE (custom)", RING_NAME = "RING MOD (custom)";
// name -> [buildBuffer, paramLabel, defaultParam]
const CUSTOM_BUFFERS: Record<
  string,
  [(param: number) => AudioBuffer, string, number]
> = {
  [PULSE_NAME]: [createPulseBuffer, "duty cycle", .5],
  [RING_NAME]: [createRingBuffer, "ratio", 2],
};

const BUFFER_NAMES = [...Object.keys(BUFFERS), ...Object.keys(CUSTOM_BUFFERS)];
const KNOB_NAMES = ["Gain", "Rate"];

type StepModel = {
  knob: number;
  isBand: boolean;
  value: number;
  valueHi: number;
  duration: number;
  exponential: boolean;
};

type LayerModel = {
  bufferName: string;
  param: number;
  steps: StepModel[];
};

const defaultStep = (): StepModel => ({
  knob: 0,
  isBand: false,
  value: 1,
  valueHi: 1,
  duration: 0.05,
  exponential: false,
});

const defaultLayer = (): LayerModel => ({
  bufferName: "SINE_BUFFER",
  param: 0,
  steps: [defaultStep()],
});

const layers: LayerModel[] = [
  {
    bufferName: "SINE_BUFFER",
    param: 0,
    steps: [
      {
        knob: 1,
        isBand: false,
        value: 1,
        valueHi: 1,
        duration: 0,
        exponential: false,
      },
      {
        knob: 0,
        isBand: false,
        value: 1,
        valueHi: 1,
        duration: .01,
        exponential: false,
      },
      {
        knob: 0,
        isBand: false,
        value: 0,
        valueHi: 0,
        duration: .1,
        exponential: false,
      },
    ],
  },
];

// buffer instances round-trip back to a name; anything else (e.g. a buffer
// built by a primitive this editor doesn't know about) falls back to sine
const loadDefinitions = (definitions: SoundDefinition[]) => {
  layers.length = 0;

  doTimes(definitions, ([buffer, schedule]: SoundDefinition) => {
    layers.push({
      bufferName: BUFFER_NAME_BY_INSTANCE.get(buffer) ?? "SINE_BUFFER",
      param: 0,
      steps: schedule.map(([[knob, value, exponential], duration = 0]) => ({
        knob,
        isBand: Array.isArray(value),
        value: Array.isArray(value) ? value[0] : value,
        valueHi: Array.isArray(value) ? value[1] : value,
        duration,
        exponential: !!exponential,
      })),
    });
  });

  if (!layers.length) layers.push(defaultLayer());

  renderLayers();
};

const layersContainer = document.getElementById("layers")!;

const renderStep = (layer: LayerModel, step: StepModel, stepIndex: number) => {
  const row = document.createElement("div");
  row.className = "step";

  const knobSelect = document.createElement("select");
  doTimes(KNOB_NAMES, (name: string, knobIndex: number) => {
    const option = document.createElement("option");
    option.value = knobIndex.toString();
    option.textContent = name;
    option.selected = knobIndex == step.knob;
    knobSelect.appendChild(option);
  });
  knobSelect.onchange = () => step.knob = +knobSelect.value;

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.step = "any";
  valueInput.value = step.value.toString();
  valueInput.oninput = () => step.value = +valueInput.value;

  const valueHiInput = document.createElement("input");
  valueHiInput.type = "number";
  valueHiInput.step = "any";
  valueHiInput.value = step.valueHi.toString();
  valueHiInput.style.display = step.isBand ? "" : "none";
  valueHiInput.oninput = () => step.valueHi = +valueHiInput.value;

  const rangeCheckbox = document.createElement("input");
  rangeCheckbox.type = "checkbox";
  rangeCheckbox.checked = step.isBand;
  rangeCheckbox.onchange = () => {
    step.isBand = rangeCheckbox.checked;
    valueHiInput.style.display = step.isBand ? "" : "none";
  };

  const rangeLabel = document.createElement("label");
  rangeLabel.append(rangeCheckbox, "range");

  const durationInput = document.createElement("input");
  durationInput.type = "number";
  durationInput.step = "any";
  durationInput.value = step.duration.toString();
  durationInput.oninput = () => step.duration = +durationInput.value;

  const expCheckbox = document.createElement("input");
  expCheckbox.type = "checkbox";
  expCheckbox.checked = step.exponential;
  expCheckbox.onchange = () => step.exponential = expCheckbox.checked;

  const expLabel = document.createElement("label");
  expLabel.append(expCheckbox, "exp");

  const removeStepButton = document.createElement("button");
  removeStepButton.textContent = "×";
  removeStepButton.onclick = () => {
    layer.steps.splice(stepIndex, 1);
    renderLayers();
  };

  row.append(
    knobSelect,
    valueInput,
    rangeLabel,
    valueHiInput,
    "for",
    durationInput,
    "s",
    expLabel,
    removeStepButton,
  );

  return row;
};

const renderLayer = (layer: LayerModel, layerIndex: number) => {
  const card = document.createElement("div");
  card.className = "layer";

  const header = document.createElement("div");
  header.className = "row";

  const bufferSelect = document.createElement("select");
  doTimes(BUFFER_NAMES, (name: string) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    option.selected = name == layer.bufferName;
    bufferSelect.appendChild(option);
  });
  bufferSelect.onchange = () => {
    layer.bufferName = bufferSelect.value;
    if (bufferSelect.value in CUSTOM_BUFFERS) {
      layer.param = CUSTOM_BUFFERS[bufferSelect.value][2];
    }
    renderLayers();
  };

  const removeLayerButton = document.createElement("button");
  removeLayerButton.textContent = "Remove layer";
  removeLayerButton.onclick = () => {
    layers.splice(layerIndex, 1);
    renderLayers();
  };

  header.append(bufferSelect, removeLayerButton);

  if (layer.bufferName in CUSTOM_BUFFERS) {
    const [, paramLabel] = CUSTOM_BUFFERS[layer.bufferName],
      paramLabelEl = document.createElement("label"),
      paramInput = document.createElement("input");

    paramInput.type = "number";
    paramInput.step = "any";
    paramInput.value = layer.param.toString();
    paramInput.oninput = () => layer.param = +paramInput.value;
    paramLabelEl.append(paramLabel, paramInput);
    header.appendChild(paramLabelEl);
  }

  card.appendChild(header);

  doTimes(
    layer.steps,
    (step: StepModel, stepIndex: number) =>
      card.appendChild(renderStep(layer, step, stepIndex)),
  );

  const addStepButton = document.createElement("button");
  addStepButton.textContent = "Add step";
  addStepButton.onclick = () => {
    layer.steps.push(defaultStep());
    renderLayers();
  };
  card.appendChild(addStepButton);

  return card;
};

const renderLayers = () => {
  layersContainer.innerHTML = "";
  doTimes(
    layers,
    (layer: LayerModel, layerIndex: number) =>
      layersContainer.appendChild(renderLayer(layer, layerIndex)),
  );
};

renderLayers();

document.getElementById("addLayer")!.onclick = () => {
  layers.push(defaultLayer());
  renderLayers();
};

const bufferFor = (layer: LayerModel): AudioBuffer =>
  layer.bufferName in CUSTOM_BUFFERS
    ? CUSTOM_BUFFERS[layer.bufferName][0](layer.param)
    : BUFFERS[layer.bufferName];

const buildDefinitions = (): SoundDefinition[] =>
  layers.map((layer) =>
    [
      bufferFor(layer),
      layer.steps.map((step) => [
        [
          step.knob,
          step.isBand ? [step.value, step.valueHi] : step.value,
          step.exponential,
        ],
        step.duration,
      ]),
    ] as SoundDefinition
  );

document.getElementById("play")!.onclick = () =>
  createSound(...buildDefinitions())();

const formatValue = (step: StepModel) =>
  step.isBand ? `[${step.value}, ${step.valueHi}]` : `${step.value}`;

const formatStep = (step: StepModel) =>
  `    [[${step.knob}, ${formatValue(step)}${
    step.exponential ? ", true" : ""
  }], ${step.duration}],`;

const formatBuffer = (layer: LayerModel) =>
  layer.bufferName in CUSTOM_BUFFERS
    ? `${CUSTOM_BUFFERS[layer.bufferName][0].name}(${layer.param})`
    : layer.bufferName;

const formatLayer = (layer: LayerModel) =>
  `  [${formatBuffer(layer)}, [\n${
    layer.steps.map(formatStep).join("\n")
  }\n  ]],`;

document.getElementById("copyCode")!.onclick = () => {
  const code = `createSound(\n${layers.map(formatLayer).join("\n")}\n)`,
    output = document.getElementById("output") as HTMLTextAreaElement;

  output.value = code;
  navigator.clipboard?.writeText(code).catch(() => {});
};
