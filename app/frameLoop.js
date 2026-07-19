let frameLoopId;
export function frameLoop(call) {
  frameLoopId = requestAnimationFrame(() => {
    call();
    frameLoop(call);
  });

  return () => clearAnimationFrame(frameLoopId);
}
