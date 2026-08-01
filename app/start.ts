import { startClock } from "~clock";
import { Controller } from "~controller";

import {
  VIEWPORT_CONTROLLER_MAP,
  VIEWPORT_STARTING_POINT,
} from "./constants.ts";
import { getCubePaint, theCubes } from "./theCubes.ts";
import { XOCamera } from "../libraries/objects/test.ts";
import { canvasTarget } from "./html.tsx";

const controller = new Controller();
const camera = new XOCamera();

camera.adjust(...VIEWPORT_STARTING_POINT);

startClock((tickLength, totalClockTime) => {
  for (const inputKeyCode of controller.activeInputs) {
    camera.adjust(...VIEWPORT_CONTROLLER_MAP[inputKeyCode]?.(tickLength));
  }

  theCubes.forEach((cube, index) => {
    cube.rotation = [Math.cos(totalClockTime), Math.sin(totalClockTime), 0];
    cube.material = getCubePaint(index + Math.floor(totalClockTime));
  });

  camera.render(theCubes, canvasTarget());
});
