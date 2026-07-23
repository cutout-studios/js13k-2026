import type { Object } from "~common";

import { system } from "./system.ts";
import { loadObject } from "./loadObject.ts";
import { getRenderTargets } from "./canvas.ts";
import { WebGPUCanvas } from "./types.ts";

let renderLoopId: number;
export const renderLoop = (canvas: WebGPUCanvas, work: () => Object[]) => {
  renderLoopId = requestAnimationFrame(() =>
    _doRenderPass(canvas, (renderProcess) => {
      for (const object of work()) {
        loadObject(renderProcess, object);

        renderProcess.draw(object.geometry.count);
      }

      renderLoop(canvas, work);
    })
  );

  return () => cancelAnimationFrame(renderLoopId);
};

function _doRenderPass(
  canvas: WebGPUCanvas,
  pass: (process: GPURenderPassEncoder) => void,
) {
  const commander = system.createCommandEncoder();
  const renderProcess = commander.beginRenderPass(getRenderTargets(canvas));

  pass(renderProcess);

  renderProcess.end();
  system.queue.submit([commander.finish()]);
}
