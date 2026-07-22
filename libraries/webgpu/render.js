import system from "./system.js";
import { loadObject } from "./loadObject.js";
import { getRenderTargets } from "./canvas.js";

export const render = (canvas, objects) => {
  _doRenderPass(canvas, (renderProcess) => {
    for (const object of objects) {
      loadObject(renderProcess, object);

      renderProcess.draw(object.geometry.size);
    }
  });
};

function _doRenderPass(canvas, pass) {
  const commander = system.createCommandEncoder();
  const renderProcess = commander.beginRenderPass(getRenderTargets(canvas));

  pass(renderProcess);

  renderProcess.end();
  system.queue.submit([commander.finish()]);
}
