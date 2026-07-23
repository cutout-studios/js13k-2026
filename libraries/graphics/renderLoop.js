import system from "./system.js";
import { loadObject } from "./loadObject.js";
import { getRenderTargets } from "./canvas.js";

let renderLoopId;
export const renderLoop = (canvas, work) => {
  renderLoopId = requestAnimationFrame(() =>
    _doRenderPass(canvas, (renderProcess) => {
      for (const object of work()) {
        loadObject(renderProcess, object);

        renderProcess.draw(object.geometry.size);
      }

      renderLoop(canvas, work);
    })
  );

  return () => clearAnimationFrame(renderLoopId);
};

function _doRenderPass(canvas, pass) {
  const commander = system.createCommandEncoder();
  const renderProcess = commander.beginRenderPass(getRenderTargets(canvas));

  pass(renderProcess);

  renderProcess.end();
  system.queue.submit([commander.finish()]);
}
