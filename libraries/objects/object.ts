import { XYZ } from "~common";
import {
  createPerspective,
  createTranslation,
  invert as _invert,
  multiply,
  ProjectiveTransform as Transform,
} from "../engine.ts";
import { Geometry } from "./geometry/types.ts";
import { Material } from "./materials/types.ts";
import { api, loadGeometry, loadMaterial, loadTransform } from "~webgpu";
import {
  DEFAULT_PERSPECTIVE_SAFETY_CROP,
  fromRigid,
  toRigid,
} from "~transforms";

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
      /* TODO: create rotation transform from rotor components */ fromRigid(
        createTranslation(this.position),
      ),
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
      invert(this.transform)
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

function loadObject(
  renderPass: GPURenderPassEncoder,
  object: XOObject,
  perspective: Transform,
) {
  loadGeometry(renderPass, object.geometry!);
  loadMaterial(renderPass, object.material!);
  loadTransform(renderPass, object, multiply(perspective, object.transform));
}
