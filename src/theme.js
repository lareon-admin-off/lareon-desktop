// Applies the chosen look before the page paints, and switches it with a slow cross-fade so it is easy on the eyes.
(function () {
  var root = document.documentElement;
  function put(t) { if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme'); }
  put(window.themePref);
  window.setTheme = function (t, animate) {
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (animate && !calm && document.startViewTransition) document.startViewTransition(function () { put(t); });
    else put(t);
  };
})();
