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
  BUZZ_BUFFER,
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
  BUZZ_BUFFER,
};
const BUFFER_NAME_BY_INSTANCE = new Map(
  Object.entries(BUFFERS).map(([name, buffer]) => [buffer, name]),
);

const PULSE_NAME = "PULSE (custom)", RING_NAME = "RING MOD (custom)";
// shown instead of silently guessing "SINE_BUFFER" for anything detectBuffer
// can't identify (e.g. a ring mod buffer built by hand outside this editor)
const UNKNOWN_NAME = "CUSTOM (unrecognized)";
// name -> [buildBuffer, paramLabel, defaultParam]
const CUSTOM_BUFFERS: Record<
  string,
  [(param: number) => AudioBuffer, string, number]
> = {
  [PULSE_NAME]: [createPulseBuffer, "duty cycle", .5],
  [RING_NAME]: [createRingBuffer, "ratio", 2],
};

// createPulseBuffer/createRingBuffer return a fresh AudioBuffer every call
// (unlike the 5 fixed singletons above), so identity alone can't recognize
// one that was built outside this editor (e.g. straight in sounds.ts). Every
// sample in a pulse buffer is exactly +1 or -1 by construction, with the
// fraction of +1 samples equal to the duty cycle it was built with - that's
// enough to detect and recover the param. this only runs in the devtool, so
// it costs nothing in the shipped game.
const detectBuffer = (buffer: AudioBuffer): [name: string, param: number] => {
  const knownName = BUFFER_NAME_BY_INSTANCE.get(buffer);
  if (knownName) return [knownName, 0];

  const data = buffer.getChannelData(0);

  if (data.every((sample) => sample == 1 || sample == -1)) {
    const dutyCycle = data.filter((sample) => sample == 1).length /
      data.length;
    return [PULSE_NAME, Math.round(dutyCycle * 100) / 100];
  }

  // ring mod isn't detectable this way (it's a smooth product of two
  // sines, not a hard two-level wave) - flagged as unknown rather than
  // guessing wrong
  return [UNKNOWN_NAME, 0];
};
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
  muted: boolean;
  // only set when bufferName is UNKNOWN_NAME - the original instance, kept
  // around so play/duplicate still work even though we can't identify it
  rawBuffer?: AudioBuffer;
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
  muted: false,
});

const layers: LayerModel[] = [
  {
    bufferName: "SINE_BUFFER",
    param: 0,
    muted: false,
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

// -- graphs: one Gain + one Rate breakpoint editor per layer --
//
// layer.steps is a single timeline shared across both knobs (createSound.ts
// runs one clock and each step's `duration` is the delta since the PREVIOUS
// step, regardless of which knob it targets) - so knob-specific breakpoints
// need their own absolute time to be graphed against a shared time axis.
// stepsToEvents/eventsToSteps convert between the two representations; every
// edit goes through that round-trip so layer.steps stays the single source
// of truth (copyCode/copyPacked/play all keep working unmodified).

type StepEvent = {
  time: number;
  knob: number;
  value: number;
  valueHi: number;
  isBand: boolean;
  exponential: boolean;
};

const snap = (n: number) => Math.round(n * 100) / 100;

const stepsToEvents = (steps: StepModel[]): StepEvent[] => {
  let time = 0;

  return steps.map((step) => {
    time += step.duration;

    return {
      time,
      knob: step.knob,
      value: step.value,
      valueHi: step.valueHi,
      isBand: step.isBand,
      exponential: step.exponential,
    };
  });
};

const eventsToSteps = (events: StepEvent[]): StepModel[] => {
  const sorted = [...events].sort((a, b) => a.time - b.time);
  let lastTime = 0;

  return sorted.map((event) => {
    const duration = snap(Math.max(0, event.time - lastTime));
    lastTime = event.time;

    return {
      knob: event.knob,
      isBand: event.isBand,
      value: event.value,
      valueHi: event.valueHi,
      duration,
      // rate/pitch ramps always sound better exponential - not worth a toggle
      exponential: event.knob == 1 ? true : event.exponential,
    };
  });
};

const SVG_NS = "http://www.w3.org/2000/svg";

const svgEl = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] => {
  const el = document.createElementNS(SVG_NS, tag) as SVGElementTagNameMap[K];

  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value.toString());
  }

  return el;
};

// drags `el` with live visual feedback via onDrag; onCommit fires once, on
// release, with whatever onDrag last reported (index into the drag itself,
// not layer.steps, since layer.steps only gets rebuilt on commit)
const makeDraggable = (
  el: SVGElement,
  svg: SVGSVGElement,
  onDrag: (x: number, y: number) => void,
  onCommit: () => void,
) => {
  el.onpointerdown = (downEvent) => {
    downEvent.stopPropagation();
    downEvent.preventDefault();
    el.setPointerCapture(downEvent.pointerId);

    const rect = svg.getBoundingClientRect();

    el.onpointermove = (moveEvent) => {
      onDrag(moveEvent.clientX - rect.left, moveEvent.clientY - rect.top);
    };

    el.onpointerup = () => {
      el.onpointermove = null;
      el.onpointerup = null;
      onCommit();
    };
  };
};

const GRAPH_WIDTH = 420,
  GRAPH_HEIGHT = 130,
  PAD_LEFT = 34,
  PAD_RIGHT = 10,
  PAD_TOP = 10,
  PAD_BOTTOM = 18,
  PLOT_WIDTH = GRAPH_WIDTH - PAD_LEFT - PAD_RIGHT,
  PLOT_HEIGHT = GRAPH_HEIGHT - PAD_TOP - PAD_BOTTOM;

const renderGraph = (layer: LayerModel, knob: number, label: string) => {
  const allEvents = stepsToEvents(layer.steps),
    knobEvents = allEvents
      .map((event, stepIndex) => ({ ...event, stepIndex }))
      .filter((event) => event.knob == knob);

  const maxTime = Math.max(0.05, ...allEvents.map((event) => event.time)) *
    1.15;
  const values = knobEvents.flatMap((event) =>
    event.isBand ? [event.value, event.valueHi] : [event.value]
  );
  const dataMin = Math.min(0, ...values), dataMax = Math.max(1, ...values);
  const valuePad = (dataMax - dataMin) * 0.15 || 0.5;
  const valueLo = dataMin - valuePad, valueHi = dataMax + valuePad;

  const timeToX = (time: number) => PAD_LEFT + (time / maxTime) * PLOT_WIDTH;
  const xToTime = (x: number) =>
    Math.max(0, (x - PAD_LEFT) / PLOT_WIDTH * maxTime);
  const valueToY = (value: number) =>
    PAD_TOP + PLOT_HEIGHT -
    (value - valueLo) / (valueHi - valueLo) * PLOT_HEIGHT;
  const yToValue = (y: number) =>
    valueLo + (PAD_TOP + PLOT_HEIGHT - y) / PLOT_HEIGHT * (valueHi - valueLo);

  const svg = svgEl("svg", {
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
    class: "graph",
  });

  // commits a full replacement of this knob's breakpoints, merged back in
  // with the other knob's (untouched) breakpoints from this same render pass
  const commit = (updatedKnobEvents: StepEvent[]) => {
    const otherEvents = allEvents.filter((event) => event.knob != knob);
    layer.steps = eventsToSteps([...otherEvents, ...updatedKnobEvents]);
    renderLayers();
  };

  const background = svgEl("rect", {
    x: PAD_LEFT,
    y: PAD_TOP,
    width: PLOT_WIDTH,
    height: PLOT_HEIGHT,
    class: "graph-bg",
  });
  background.onclick = (clickEvent) => {
    const rect = svg.getBoundingClientRect(),
      x = clickEvent.clientX - rect.left,
      y = clickEvent.clientY - rect.top,
      value = snap(yToValue(y));

    commit([...knobEvents, {
      time: snap(xToTime(x)),
      knob,
      value,
      valueHi: value,
      isBand: false,
      exponential: false,
    }]);
  };
  svg.appendChild(background);

  if (valueLo < 0 && valueHi > 0) {
    svg.appendChild(svgEl("line", {
      x1: PAD_LEFT,
      x2: GRAPH_WIDTH - PAD_RIGHT,
      y1: valueToY(0),
      y2: valueToY(0),
      class: "graph-zero",
    }));
  }

  // axis labels: 3 value ticks on the left, start/end time ticks on the bottom
  doTimes([valueHi, (valueLo + valueHi) / 2, valueLo], (tickValue: number) => {
    const tickLabel = svgEl("text", {
      x: PAD_LEFT - 4,
      y: valueToY(tickValue) + 3,
      class: "graph-axis-label graph-axis-label-y",
    });
    tickLabel.textContent = tickValue.toFixed(2);
    svg.appendChild(tickLabel);
  });

  doTimes([0, maxTime], (tickTime: number, index: number) => {
    const tickLabel = svgEl("text", {
      x: timeToX(tickTime),
      y: GRAPH_HEIGHT - 4,
      class: "graph-axis-label " +
        (index == 0 ? "graph-axis-label-x-start" : "graph-axis-label-x-end"),
    });
    tickLabel.textContent = `${tickTime.toFixed(2)}s`;
    svg.appendChild(tickLabel);
  });

  if (knobEvents.length) {
    const points = knobEvents
      .map((event) =>
        `${timeToX(event.time)},${
          valueToY(
            event.isBand ? (event.value + event.valueHi) / 2 : event.value,
          )
        }`
      )
      .join(" ");
    svg.appendChild(svgEl("polyline", { points, class: "graph-line" }));
  }

  doTimes(knobEvents, (event: StepEvent & { stepIndex: number }) => {
    const x = timeToX(event.time),
      replaceThis = (replacement: StepEvent) =>
        knobEvents.map((e) => e.stepIndex == event.stepIndex ? replacement : e),
      removeThis = () =>
        knobEvents.filter((e) => e.stepIndex != event.stepIndex);

    const bandToggle = svgEl("text", {
      x: x + 7,
      y: valueToY(event.isBand ? event.valueHi : event.value) - 6,
      class: "graph-toggle",
    });
    bandToggle.textContent = "±";
    bandToggle.onclick = (clickEvent) => {
      clickEvent.stopPropagation();
      commit(
        replaceThis(
          event.isBand
            ? {
              ...event,
              isBand: false,
              value: (event.value + event.valueHi) / 2,
            }
            : { ...event, isBand: true, valueHi: event.value + 0.2 },
        ),
      );
    };
    svg.appendChild(bandToggle);

    // rate ramps are always exponential (see eventsToSteps) - no toggle needed
    if (knob != 1) {
      const expToggle = svgEl("text", {
        x: x + 18,
        y: valueToY(event.isBand ? event.valueHi : event.value) - 6,
        class: "graph-toggle" +
          (event.exponential ? " graph-toggle-active" : ""),
      });
      expToggle.textContent = "e";
      expToggle.onclick = (clickEvent) => {
        clickEvent.stopPropagation();
        commit(replaceThis({ ...event, exponential: !event.exponential }));
      };
      svg.appendChild(expToggle);
    }

    if (event.isBand) {
      let liveTime = event.time, liveLo = event.value, liveHi = event.valueHi;

      const rangeLine = svgEl("line", {
        x1: x,
        x2: x,
        y1: valueToY(liveLo),
        y2: valueToY(liveHi),
        class: "graph-range",
      });
      const loDot = svgEl("circle", {
        cx: x,
        cy: valueToY(liveLo),
        r: 6,
        class: "graph-point graph-point-lo",
      });
      const hiDot = svgEl("circle", {
        cx: x,
        cy: valueToY(liveHi),
        r: 6,
        class: "graph-point graph-point-hi",
      });

      const reposition = () => {
        const px = timeToX(liveTime);
        rangeLine.setAttribute("x1", px.toString());
        rangeLine.setAttribute("x2", px.toString());
        rangeLine.setAttribute("y1", valueToY(liveLo).toString());
        rangeLine.setAttribute("y2", valueToY(liveHi).toString());
        loDot.setAttribute("cx", px.toString());
        loDot.setAttribute("cy", valueToY(liveLo).toString());
        hiDot.setAttribute("cx", px.toString());
        hiDot.setAttribute("cy", valueToY(liveHi).toString());
      };
      const commitBand = () =>
        commit(
          replaceThis({
            ...event,
            time: liveTime,
            value: liveLo,
            valueHi: liveHi,
          }),
        );

      makeDraggable(loDot, svg, (_x, y) => {
        liveLo = snap(Math.min(yToValue(y), liveHi));
        reposition();
      }, commitBand);
      makeDraggable(hiDot, svg, (_x, y) => {
        liveHi = snap(Math.max(yToValue(y), liveLo));
        reposition();
      }, commitBand);
      makeDraggable(rangeLine, svg, (x) => {
        liveTime = snap(xToTime(x));
        reposition();
      }, commitBand);

      rangeLine.ondblclick = (dblClickEvent) => {
        dblClickEvent.stopPropagation();
        commit(removeThis());
      };

      svg.append(rangeLine, loDot, hiDot);
    } else {
      let liveTime = event.time, liveValue = event.value;

      const dot = svgEl("circle", {
        cx: x,
        cy: valueToY(liveValue),
        r: 6,
        class: "graph-point",
      });

      makeDraggable(dot, svg, (x, y) => {
        liveTime = snap(xToTime(x));
        liveValue = snap(yToValue(y));
        dot.setAttribute("cx", timeToX(liveTime).toString());
        dot.setAttribute("cy", valueToY(liveValue).toString());
      }, () =>
        commit(
          replaceThis({
            ...event,
            time: liveTime,
            value: liveValue,
            valueHi: liveValue,
          }),
        ));

      dot.ondblclick = (dblClickEvent) => {
        dblClickEvent.stopPropagation();
        commit(removeThis());
      };

      svg.appendChild(dot);
    }
  });

  const wrapper = document.createElement("div");
  wrapper.className = "graph-wrapper";
  const title = document.createElement("div");
  title.className = "graph-label";
  title.textContent = `${label} (click to add, drag to move, ± for range, ${
    knob == 1 ? "always exponential" : "e for exponential"
  }, dbl-click to delete)`;
  wrapper.append(title, svg);

  return wrapper;
};

const loadDefinitions = (definitions: SoundDefinition[]) => {
  layers.length = 0;

  doTimes(definitions, ([buffer, schedule]: SoundDefinition) => {
    const [bufferName, param] = detectBuffer(buffer);

    layers.push({
      bufferName,
      param,
      muted: false,
      rawBuffer: bufferName == UNKNOWN_NAME ? buffer : undefined,
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
  knobSelect.onchange = () => {
    step.knob = +knobSelect.value;
    // rate ramps are always exponential - see eventsToSteps
    if (step.knob == 1) step.exponential = true;
    renderLayers();
  };

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.step = "0.001";
  valueInput.value = step.value.toString();
  valueInput.oninput = () => step.value = +valueInput.value;

  const valueHiInput = document.createElement("input");
  valueHiInput.type = "number";
  valueHiInput.step = "0.001";
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
  durationInput.step = "0.001";
  durationInput.value = step.duration.toString();
  durationInput.oninput = () => step.duration = +durationInput.value;

  const expCheckbox = document.createElement("input");
  expCheckbox.type = "checkbox";
  expCheckbox.checked = step.knob == 1 ? true : step.exponential;
  expCheckbox.disabled = step.knob == 1; // rate is always exponential
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
  doTimes([
    "SINE_BUFFER",
    "SQUARE_BUFFER",
    "TRIANGLE_BUFFER",
    "SAWTOOTH_BUFFER",
    "NOISE_BUFFER",
    "BUZZ_BUFFER",
    ...Object.keys(CUSTOM_BUFFERS),
  ], (name: string) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    option.selected = name == layer.bufferName;
    bufferSelect.appendChild(option);
  });
  // only shown for a layer that's currently unrecognized - not a real choice
  // you can switch into from scratch, since there's nothing to build it from
  if (layer.bufferName == UNKNOWN_NAME) {
    const option = document.createElement("option");
    option.value = UNKNOWN_NAME;
    option.textContent = UNKNOWN_NAME;
    option.selected = true;
    bufferSelect.appendChild(option);
  }
  bufferSelect.onchange = () => {
    layer.bufferName = bufferSelect.value;
    layer.rawBuffer = undefined;
    if (bufferSelect.value in CUSTOM_BUFFERS) {
      layer.param = CUSTOM_BUFFERS[bufferSelect.value][2];
    }
    renderLayers();
  };

  const muteButton = document.createElement("button");
  muteButton.textContent = layer.muted ? "Unmute" : "Mute";
  muteButton.className = layer.muted ? "muted" : "";
  muteButton.onclick = () => {
    layer.muted = !layer.muted;
    renderLayers();
  };

  const duplicateLayerButton = document.createElement("button");
  duplicateLayerButton.textContent = "Duplicate layer";
  duplicateLayerButton.onclick = () => {
    layers.splice(layerIndex + 1, 0, {
      bufferName: layer.bufferName,
      param: layer.param,
      muted: layer.muted,
      rawBuffer: layer.rawBuffer,
      steps: layer.steps.map((step) => ({ ...step })),
    });
    renderLayers();
  };

  const removeLayerButton = document.createElement("button");
  removeLayerButton.textContent = "Remove layer";
  removeLayerButton.onclick = () => {
    layers.splice(layerIndex, 1);
    renderLayers();
  };

  header.append(
    bufferSelect,
    muteButton,
    duplicateLayerButton,
    removeLayerButton,
  );

  if (layer.bufferName in CUSTOM_BUFFERS) {
    const [, paramLabel] = CUSTOM_BUFFERS[layer.bufferName],
      paramLabelEl = document.createElement("label"),
      paramInput = document.createElement("input");

    paramInput.type = "number";
    paramInput.step = "0.01";
    paramInput.value = layer.param.toString();
    paramInput.oninput = () => layer.param = +paramInput.value;
    paramLabelEl.append(paramLabel, paramInput);
    header.appendChild(paramLabelEl);
  }

  card.appendChild(header);

  card.append(
    renderGraph(layer, 0, "Gain"),
    renderGraph(layer, 1, "Rate"),
  );

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
  layer.bufferName == UNKNOWN_NAME && layer.rawBuffer
    ? layer.rawBuffer
    : layer.bufferName in CUSTOM_BUFFERS
    ? CUSTOM_BUFFERS[layer.bufferName][0](layer.param)
    : BUFFERS[layer.bufferName];

const buildDefinitions = (): SoundDefinition[] =>
  layers.filter((layer) => !layer.muted).map((layer) =>
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
  layer.bufferName == UNKNOWN_NAME
    ? "/* unrecognized buffer - fill this back in by hand */ SINE_BUFFER"
    : layer.bufferName in CUSTOM_BUFFERS
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
