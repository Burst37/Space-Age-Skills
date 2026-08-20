// StepScroll — converts wheel/trackpad/touch into discrete +1/-1 steps.
// Threshold + interval prevent skipping multiple projects on a fast fling.
export class StepScroll {
  constructor({ target, onStep, threshold = 14, interval = 55 }) {
    this.target = target;
    this.onStep = onStep;
    this.threshold = threshold;
    this.interval = interval;
    this.accum = 0;
    this.last = 0;
    this.touchY = null;
    this._bind();
  }

  _bind() {
    this.target.addEventListener("wheel", this._onWheel, { passive: false });
    this.target.addEventListener("touchstart", this._onTouchStart, { passive: true });
    this.target.addEventListener("touchmove", this._onTouchMove, { passive: false });
    this.target.addEventListener("touchend", this._onTouchEnd, { passive: true });
    window.addEventListener("keydown", this._onKey);
  }

  _commit(dir) {
    const now = performance.now();
    if (now - this.last < this.interval) return false;
    this.last = now;
    this.accum = 0;
    this.onStep(dir);
    return true;
  }

  _onWheel = (e) => {
    e.preventDefault();
    this.accum += e.deltaY;
    if (this.accum >= this.threshold) this._commit(1);
    else if (this.accum <= -this.threshold) this._commit(-1);
  };

  _onTouchStart = (e) => { this.touchY = e.touches[0].clientY; };

  _onTouchMove = (e) => {
    if (this.touchY === null) return;
    e.preventDefault();
    const dy = this.touchY - e.touches[0].clientY;
    if (Math.abs(dy) > 28) {
      if (this._commit(dy > 0 ? 1 : -1)) this.touchY = e.touches[0].clientY;
    }
  };

  _onTouchEnd = () => { this.touchY = null; };

  _onKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") this._commit(1);
    else if (e.key === "ArrowUp"   || e.key === "PageUp")   this._commit(-1);
  };
}
