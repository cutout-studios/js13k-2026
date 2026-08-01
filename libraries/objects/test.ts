import { XYZ } from "~common";
import {
  createPerspective,
  createRotation,
  createTranslation,
  invert as _invert,
  multiply,
  ProjectiveTransform as Transform,
} from "../engine.ts";
import { Geometry } from "./geometry/types.ts";
import { Material } from "./materials/types.ts";
import { api, loadGeometry, loadMaterial, TRANSFORM_GROUP_ID } from "~webgpu";
import {
  DEFAULT_PERSPECTIVE_SAFETY_CROP,
  fromRigid,
  PROJECTIVE_TRANSFORM_BYTES,
  toRigid,
} from "~transforms";
import { transformsLayout } from "../webgpu/getRenderPipeline.ts";
import { getDataContainer, writeData } from "../webgpu/load/writeData.ts";

type RenderTarget = GPURenderPassDescriptor & {
  aspectRatio: number;
};

const DEFAULT_VIEWING_RADIANS = Math.PI / 2;
const XYZ_ORIGIN: () => XYZ = () => [0, 0, 0];

const sumXYZ = (
  [x1, y1, z1]: XYZ = XYZ_ORIGIN(),
  [x2, y2, z2]: XYZ = XYZ_ORIGIN(),
) => [x1 + x2, y1 + y2, z1 + z2] as XYZ;

export class XOObject {
  geometry?: Geometry;
  position: XYZ;
  rotation: XYZ;
  material?: Material;

  constructor(
    geometry?: Geometry,
    position?: XYZ,
    rotation?: XYZ,
    material?: Material,
  ) {
    this.geometry = geometry;
    this.material = material;
    this.position = position ?? XYZ_ORIGIN();
    this.rotation = rotation ?? XYZ_ORIGIN();
  }

  get transform(): Transform {
    return multiply(
      fromRigid(
        createTranslation(this.position),
      ),
      fromRigid(createRotation([1, 0, 0], this.rotation[0])),
      fromRigid(createRotation([0, 1, 0], this.rotation[1])),
      fromRigid(createRotation([0, 0, 1], this.rotation[2])),
    ); // TODO: inline
  }

  adjust(position?: XYZ, rotation?: XYZ) {
    this.position = sumXYZ(this.position, position);
    this.rotation = sumXYZ(this.rotation, rotation);
  }
}

export class XOCamera extends XOObject {
  viewingRadians: number = DEFAULT_VIEWING_RADIANS;
  safetyCropDistance: number = DEFAULT_PERSPECTIVE_SAFETY_CROP;

  render(objects: XOObject[], target: RenderTarget) {
    const encoder = api.createCommandEncoder();
    const renderPass = encoder.beginRenderPass(target);

    const view = multiply(
      createPerspective(
        target.aspectRatio,
        this.viewingRadians,
        this.safetyCropDistance,
      ),
      invert(this.transform),
    );

    for (const object of objects) {
      if (!object.geometry) continue; // skip null objects

      loadObject(renderPass, object, view);

      renderPass.draw(object.geometry.length);
    }

    renderPass.end();
    api.queue.submit([encoder.finish()]);
  }
}

// TODO: consolidate/inline these
function invert(transform: Transform): Transform {
  return fromRigid(_invert(toRigid(transform)));
}

export const loadTransform = (
  loader: GPURenderPassEncoder,
  object: XOObject,
  transform: Transform,
) =>
  writeData({
    loader,
    data: transform,
    container: getDataContainer(
      object,
      transformsLayout,
      PROJECTIVE_TRANSFORM_BYTES,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    ),
    groupID: TRANSFORM_GROUP_ID,
  });

function loadObject(
  renderPass: GPURenderPassEncoder,
  object: XOObject,
  perspective: Transform,
) {
  loadGeometry(renderPass, object.geometry!);
  loadMaterial(renderPass, object.material!);
  loadTransform(renderPass, object, multiply(perspective, object.transform));
}
