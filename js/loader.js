/* ============================================================
   PAGE LOADER — Dr. Tecla Tum Foundation
   Load BEFORE js/script.js
   ============================================================ */
(function () {
  'use strict';

  var loader = document.getElementById('pageLoader');
  if (!loader) return;

  var fill  = document.getElementById('loaderBarFill');
  var count = document.getElementById('loaderCount');
  var root  = document.documentElement;

  var MIN_MS  = 1300;  // minimum time on screen (stops it flashing)
  var MAX_MS  = 6000;  // hard safety stop
  var FADE_MS = 500;   // must match the CSS transition

  var start     = Date.now();
  var progress  = 0;
  var finished  = false;
  var rafId     = null;

  function render(p) {
    p = Math.max(0, Math.min(100, p));
    if (fill)  fill.style.width = p + '%';
    if (count) count.textContent = Math.round(p) + '%';
    loader.setAttribute('aria-valuenow', Math.round(p));
  }

  function tick() {
    // ease asymptotically toward 90% while the page is still loading
    var target = 90;
    progress += (target - progress) * 0.055;
    if (target - progress < 0.4) progress = target;
    render(progress);
    rafId = requestAnimationFrame(tick);
  }

  function finish() {
    if (finished) return;
    finished = true;

    if (rafId) cancelAnimationFrame(rafId);

    var elapsed = Date.now() - start;
    var wait    = Math.max(0, MIN_MS - elapsed);

    window.setTimeout(function () {
      render(100);

      // let the bar reach 100% before the fade begins
      window.setTimeout(function () {
        loader.classList.add('is-done');
        root.classList.remove('is-loading');

        window.setTimeout(function () {
          if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, FADE_MS);
      }, 220);
    }, wait);
  }

  /* start the animation */
  rafId = requestAnimationFrame(tick);

  /* finish on window load — or immediately if it already fired */
  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
  }

  /* last-resort: also fire on DOM ready in case `load` stalls on a slow image */
  document.addEventListener('DOMContentLoaded', function () {
    window.setTimeout(finish, 3500);
  });

  /* absolute safety net */
  window.setTimeout(finish, MAX_MS);
})();