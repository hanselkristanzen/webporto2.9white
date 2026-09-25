/**
 * Tracks whether the tab is currently visible via a single shared
 * `visibilitychange` listener, registered once for the whole page, rather
 * than every animation loop (Particles, Aurora, VariableProximity, ...)
 * registering its own. Consumers call `isDocumentVisible()` imperatively
 * inside their own requestAnimationFrame callback — this deliberately
 * doesn't trigger a React re-render, since the whole point is to let a
 * render loop skip its own (expensive) work while backgrounded without
 * paying for a component re-render to find that out.
 *
 * Browsers already throttle rAF significantly in hidden tabs, but that's
 * a frequency reduction, not a guarantee of zero work — a WebGL effect
 * that reschedules itself will still submit a full render call each time
 * it *does* fire. Skipping that submission entirely while hidden is a
 * real reduction, not just a smaller version of the same cost.
 */
let isVisible = typeof document === "undefined" ? true : !document.hidden;

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    isVisible = !document.hidden;
  });
}

export function isDocumentVisible(): boolean {
  return isVisible;
}
