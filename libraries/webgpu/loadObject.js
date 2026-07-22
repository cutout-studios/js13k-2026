import system from "./system.js";

const TRANSFORM_BYTES = 64;
const TRANSFORM_DATA_GROUP_INDEX = 0;
const TRANSFORM_DATA_INSTANCE_INDEX = 0;

const VERTEX_DATA_INDEX = 0;

export const loadObject = (
  loader,
  { geometry, transform, material },
) => {
  loader.setPipeline(material);
  loader.setBindGroup(
    TRANSFORM_DATA_GROUP_INDEX,
    _getTransformDataLocation(transform),
  );
  loader.setVertexBuffer(VERTEX_DATA_INDEX, geometry.data);
};

const _transformDataLocations = new WeakMap();
function _getTransformDataLocation(transform) {
  if (_transformDataLocations.has(transform)) {
    return _transformDataLocations.get(transform);
  }

  const data = system.createBuffer({
    size: TRANSFORM_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  system.queue.writeBuffer(data, 0, transform);

  const dataAddress = system.createBindGroup({
    layout: renderPass.pipeline.getBindGroupLayout(TRANSFORM_DATA_GROUP_INDEX),
    entries: [{ binding: TRANSFORM_DATA_INSTANCE_INDEX, resource: { buffer } }],
  });

  _transformDataLocations.set(transform, dataAddress);

  return dataAddress;
}
