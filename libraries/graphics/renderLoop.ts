import { type Camera, type Object, SECONDS_TO_MS } from "~common";
import { compose, createPerspective, invert } from "~objects";

import { system } from "./system.ts";
import { loadObject } from "./loadObject.ts";
import { getRenderTargets } from "./canvas.ts";

let renderLoopId: number;
export const renderLoop = (
  canvas: HTMLCanvasElement,
  work: (deltaTime: number) => { objects: Object[]; camera: Camera },
) => {
  let last = performance.now();
  renderLoopId = requestAnimationFrame(() =>
    _doRenderPass(canvas, (renderProcess) => {
      const now = performance.now();
      const deltaTime = (now - last) / SECONDS_TO_MS;
      last = now;
      const { objects, camera } = work(deltaTime);
      for (const object of objects) {
        loadObject(renderProcess, {
          ...object,
          transform: compose(
            object.transform,
            invert(camera.transform),
            createPerspective(canvas.width / canvas.height, camera.fov),
          ),
        });

        renderProcess.draw(object.geometry.length);
      }

      renderLoop(canvas, work);
    })
  );

  return () => cancelAnimationFrame(renderLoopId);
};

function _doRenderPass(
  canvas: HTMLCanvasElement,
  pass: (process: GPURenderPassEncoder) => void,
) {
  const commander = system.createCommandEncoder();
  const renderProcess = commander.beginRenderPass(getRenderTargets(canvas));

  pass(renderProcess);

  renderProcess.end();
  system.queue.submit([commander.finish()]);
}
