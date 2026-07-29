import { api } from "../system.ts";

type DataContainer = [buffer: GPUBuffer, bindGroup: GPUBindGroup];

const _containerCache = new WeakMap<
  object,
  [buffer: GPUBuffer, bindGroup: GPUBindGroup]
>();

export const writeData = ({
  loader,
  data,
  container: [buffer, bindGroup],
  groupID,
}: {
  loader: GPURenderPassEncoder;
  data: Float32Array;
  container: DataContainer;
  groupID: number;
}) => {
  api.queue.writeBuffer(buffer, 0, data);
  loader.setBindGroup(groupID, bindGroup);
};

export const getDataContainer = (
  objectKey: object,
  layout: GPUPipelineLayout,
  size: number,
  usage: number,
): DataContainer => {
  let [buffer, bindGroup] = _containerCache.get(objectKey) ?? [];

  if (!buffer || buffer && buffer.size < size) {
    buffer = api.createBuffer({ size, usage });
  }

  bindGroup ??= api.createBindGroup({
    layout,
    entries: [{ binding: 0, resource: buffer }],
  });

  const binding: DataContainer = [
    buffer,
    bindGroup,
  ];

  _containerCache.set(objectKey, binding);

  return binding;
};
