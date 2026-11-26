// Runs before the website's notice script: its requests (appeal, "seen", the waiting notice) go through the app,
// which adds the session itself and only allows those three addresses.
(function () {
  var q = new URLSearchParams(location.search), d = {};
  try { d = JSON.parse(q.get('d') || '{}'); } catch (e) {}
  window.__notice = d;
  try { if (d.user) localStorage.setItem('lu', d.user); localStorage.setItem('lt', 'app'); } catch (e) {}
  window.fetch = function (input, init) {
    var url = String(input && input.url || input), p = url.replace(/^https:\/\/lareon\.org/, '');
    init = init || {};
    return window.lareon.noticeApi({ path: p, method: init.method || 'GET', body: init.body ? String(init.body) : '' }).then(function (r) {
      return new Response(JSON.stringify(r.j || {}), { status: r.status || 599, headers: { 'Content-Type': 'application/json' } });
    });
  };
})();
