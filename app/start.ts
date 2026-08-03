import { createRenderTarget, XOCamera } from "~3D";
import { startClock } from "~clock";
import { XOController } from "~controller";

import { CAMERA_CONTROLLER_MAP, CAMERA_STARTING_POINT } from "./constants.ts";
import { paintCube, theCubes } from "./theCubes.ts";
import { canvas } from "./html.tsx";

const camera = new XOCamera(), controller = new XOController();

camera.adjust(CAMERA_STARTING_POINT);

startClock((tickLength, totalClockTime) => {
  for (const inputKeyCode of controller.activeInputs) {
    camera.adjust(...(CAMERA_CONTROLLER_MAP[inputKeyCode]?.(tickLength) ?? []));
  }

  theCubes.forEach((cube, index) => {
    cube.adjust(undefined, [[tickLength, tickLength, tickLength], tickLength]);
    cube.material = paintCube(index + Math.floor(totalClockTime));
  });

  camera.render(theCubes, createRenderTarget(canvas));
});
