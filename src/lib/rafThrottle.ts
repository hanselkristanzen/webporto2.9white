/**
 * Coalesces rapid, repeated calls to at most one per animation frame.
 *
 * `resize` in particular can fire dozens of times a second while a window
 * is being dragged, and several components in this codebase respond to it
 * by resizing a WebGL canvas (a genuinely expensive operation — it
 * reallocates GPU-side buffers). Throttling to the display's own refresh
 * cadence means the expensive work happens at most as often as the screen
 * can actually show a new frame, instead of once per raw event.
 */
export function rafThrottle<Args extends unknown[]>(
  fn: (...args: Args) => void
): ((...args: Args) => void) & { cancel: () => void } {
  let frame: number | null = null;
  let lastArgs: Args;

  const throttled = (...args: Args) => {
    lastArgs = args;
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      fn(...lastArgs);
    });
  };

  throttled.cancel = () => {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };

  return throttled;
}
