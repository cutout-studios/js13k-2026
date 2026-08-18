import {
  CAMERA_MAGNIFICATION_RATIO,
  createCamera,
  createRenderTarget,
  XOObject,
  XYZ,
} from "~3D";
import { createElement, style } from "~alias";
import { MAX_DISTANCE } from "./constants.ts";

export const canvas = createElement("canvas") as HTMLCanvasElement,
  camera = createCamera();

style(
  canvas,
  { width: "100%", height: "100%", display: "block" },
);

export const render = (objects: XOObject[]) =>
  camera(objects, createRenderTarget(canvas as HTMLCanvasElement));

export const mapClientXY = (
  [clientX, clientY]: [number, number],
  distance = MAX_DISTANCE,
): XYZ => {
  const { clientWidth, clientHeight, offsetLeft, offsetTop } = canvas;

  const scale = distance / (clientHeight * CAMERA_MAGNIFICATION_RATIO);
  return [
    (2 * (clientX - offsetLeft) - clientWidth) * scale,
    (clientHeight - 2 * (clientY - offsetTop)) * scale,
    -distance,
  ];
};
