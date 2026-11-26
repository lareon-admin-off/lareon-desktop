// Shows the notice the app was given, keeps the logo local, and closes the window when the notice is dismissed.
(function () {
  var d = window.__notice || {};
  function fix() { document.querySelectorAll('img[src="/lareon-icon.svg"]').forEach(function (i) { i.src = 'notice-icon.svg'; }); }
  var had = false;
  new MutationObserver(function () {
    fix();
    var o = document.getElementById('lxn');
    if (o) had = true; else if (had) window.lareon.noticeClose();
  }).observe(document.documentElement, { childList: true, subtree: true });
  function show(x) { if (x && x.level && window.lxNotice) window.lxNotice.show(x.level, x.data || {}); }
  show(d);
  window.lareon.onNotice(function (x) { had = false; show(x); });
  // "Back to Lareon" goes back to the app instead of opening the website
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href="https://lareon.org"], a[href="/account"]'); if (a) { e.preventDefault(); window.lareon.noticeClose(); } }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.level && ['reminder', 'warning', 'final', 'restricted'].indexOf(d.level) >= 0) window.lareon.noticeClose(); });
})();
