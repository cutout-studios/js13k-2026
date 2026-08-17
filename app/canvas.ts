import {
  CAMERA_FOCAL_LENGTH,
  createCamera,
  createRenderTarget,
  XOObject,
  XYZ,
} from "~3D";
import { createElement, style } from "~alias";

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
  distance = -300,
): XYZ => {
  const { clientWidth, clientHeight, offsetLeft, offsetTop } = canvas;

  const scale = distance / (clientHeight * CAMERA_FOCAL_LENGTH);
  return [
    (2 * (clientX - offsetLeft) - clientWidth) * scale,
    (clientHeight - 2 * (clientY - offsetTop)) * scale,
    -distance,
  ];
};
