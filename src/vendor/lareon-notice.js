/* Copy of lareon.org/lareon-notice.js (the formal account notices). Keep in step with the website. */
/* lareon-v18: formal account notices (Terms §16), mildest to harshest:
   1 reminder · 2 formal warning · 3 final warning · 4 restricted · 5 suspended (short) · 6 suspended (long)
   7 suspended pending review · 8 terminated.
   Loaded first on the sign-in page, Fledge, the admin panel and every app. It watches the app's own requests:
   - X-Lareon-Notice on any answer: a reminder, warning or restriction is waiting; fetched and shown once.
   - 403 {code:'restricted'}: a restricted feature was used; the restriction notice is shown again.
   - 403 {code:'suspended'} or {error:'banned'} at sign-in: the suspension or termination notice.
   window.lxNotice.preview(level) shows a sample (admin Tools page). */
(function () {
  if (window.lxNotice) return;
  var ORDER = ['reminder', 'warning', 'final', 'restricted', 'short', 'long', 'review', 'term', 'network', 'reported'];
  var NAME = { reminder: 'Reminder', warning: 'Formal warning', final: 'Final warning', restricted: 'Restriction', short: 'Suspension', long: 'Suspension', review: 'Suspension pending review', term: 'Termination', network: 'Network block', reported: 'Closed and reported' };
  var LV = {
    reminder: { c: '#6d92ee', badge: 'Reminder', title: 'A reminder about the Lareon rules', text: 'Activity on this account came close to breaking the Lareon Terms of Service. This is a reminder only, and no action has been taken.', warn: 'Your account works normally. Nothing is recorded against it beyond this reminder.', ack: 'I understand' },
    warning: { c: '#8f7bff', badge: 'Formal warning', title: 'You’ve received a formal warning', text: 'The Larsonian authorities have found that this account was used in a way that breaks the Lareon Terms of Service. Your account still works, and nothing has been taken away.', warn: 'This warning stays on your account’s record. Further violations can lead to restrictions or suspension.', ack: 'I understand' },
    final: { c: '#f5c542', badge: 'Final warning', title: 'This is your final warning', text: 'This account has broken the Lareon Terms of Service again after an earlier warning. Your account still works for now.', warn: 'Any further violation will lead to suspension without another warning.', ack: 'I understand' },
    restricted: { c: '#ffa11f', badge: 'Account restricted', title: 'Some features are switched off', text: 'The Larsonian authorities have restricted this account for breaking the Lareon Terms of Service. Everything else keeps working normally.', warn: 'The features above come back by themselves when the restriction ends. Further violations can lead to suspension.', ack: 'Continue' },
    short: { c: '#ff8a1f', badge: 'Account suspended', title: 'Your account is suspended', text: 'The Larsonian authorities have suspended this account for a short time. You can’t sign in to Fledge, Aster, Ember or any other Lareon service until it ends.', warn: 'Your mail, files and everything else are safe, and mail sent to you keeps arriving. The account opens again by itself on the date above.' },
    long: { c: '#ff6a2b', badge: 'Account suspended', title: 'Your account is suspended', text: 'The Larsonian authorities have suspended this account for a serious or repeated violation of the Lareon Terms of Service. Sign-in is disabled across every Lareon service.', warn: 'Nothing has been deleted, and mail keeps arriving. Further violations can lead to permanent termination. Creating another account to get around this suspension is itself a violation.' },
    review: { c: '#ff5a3c', badge: 'Suspended · under review', title: 'Your account is suspended until it’s reviewed', text: 'The Larsonian authorities have suspended this account with no end date, while a person looks at what happened. Sign-in is disabled across every Lareon service.', warn: 'Nothing has been deleted yet. The review can end the suspension or lead to permanent termination. Writing to us now is the best way to be heard.' },
    term: { c: '#ff3b57', badge: 'Lareon account terminated', title: 'Your Lareon account has been terminated', text: 'The Larsonian authorities have permanently terminated this account for violating the Lareon Terms of Service. Fledge, Aster, Ember and every other Lareon service are closed to it.', warn: 'This decision is final unless overturned on appeal. Creating another account to get around it is a further violation and will be treated as one.' },
    reported: { c: '#d91f3c', badge: 'Account closed · reported', title: 'This account has been closed and reported', text: 'The Larsonian authorities have permanently closed this account because it was used for content or activity that is illegal or puts people in danger. Lareon reports cases like this to the relevant authorities, as the law requires.', warn: 'The account’s data has been kept for the authorities and can’t be downloaded or deleted. You may not open a new Lareon account, and Lareon is no longer available in this browser or on the networks this account used.' },
    network: { c: '#ff4d6a', badge: 'Network blocked', title: 'Lareon isn’t available from this network', text: 'This network has been blocked from Lareon because of abuse coming from it. Fledge, Aster, Ember and every other Lareon service are unavailable here.', warn: 'If you share this network with others, such as at a school, workplace or café, and you think this is a mistake, write to us from another network and include the time you saw this.' },
    signup: { c: '#ff4d6a', badge: 'Sign-ups paused', title: 'New accounts can’t be made here right now', text: 'A Lareon account connected to this network or browser was recently closed, so new accounts can’t be created from here for a while. Existing accounts can still sign in normally.', warn: 'The pause ends by itself. If you share this network with someone else and this is a mistake, write to us and we’ll lift it.' },
  };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var css = '#lxn{position:fixed;inset:0;z-index:2147483000;background:#13111b;color:#ece9f5;font-family:Geist,Inter,system-ui,-apple-system,sans-serif;overflow-y:auto;-webkit-font-smoothing:antialiased;animation:lxnF .25s ease both}' +
    '#lxn *{box-sizing:border-box}' +
    '#lxn::before{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(640px 400px at 50% -6%,color-mix(in srgb,var(--c) 22%,transparent),transparent 70%),radial-gradient(600px 380px at 50% 108%,rgba(163,92,245,.08),transparent 70%)}' +
    '#lxn .w{position:relative;max-width:420px;margin:0 auto;padding:56px 20px 40px;text-align:center}' +
    '#lxn .lg{width:96px;height:96px;margin:0 auto 22px;display:block;filter:drop-shadow(0 0 28px color-mix(in srgb,var(--c) 55%,transparent));animation:lxnUp .6s cubic-bezier(.2,.8,.2,1) both}' +
    '#lxn .bd{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--c);background:color-mix(in srgb,var(--c) 12%,transparent);border:1px solid color-mix(in srgb,var(--c) 40%,transparent);border-radius:999px;padding:6px 14px;margin-bottom:16px;animation:lxnUp .6s .05s cubic-bezier(.2,.8,.2,1) both}' +
    '#lxn h1{font-size:28px;font-weight:600;letter-spacing:-.03em;line-height:1.15;margin:0 0 10px;animation:lxnUp .6s .1s cubic-bezier(.2,.8,.2,1) both}' +
    '#lxn .tx{color:#a9a6bd;font-size:14px;line-height:1.55;margin:0 auto 24px;max-width:350px;animation:lxnUp .6s .15s cubic-bezier(.2,.8,.2,1) both}' +
    '#lxn .bx{text-align:left;background:rgba(255,255,255,.04);border:1px solid #2b2838;border-radius:14px;margin-bottom:14px;font-size:13.5px;overflow:hidden;animation:lxnUp .6s .2s cubic-bezier(.2,.8,.2,1) both}' +
    '#lxn .bx>div{padding:13px 18px}#lxn .bx>div+div{border-top:1px solid #2b2838}' +
    '#lxn .bx small{display:block;font-size:12px;color:#8d8aa3;margin-bottom:3px}#lxn .bx b{font-weight:600}#lxn .bx i{font-style:normal;color:var(--c);font-weight:500;margin-left:6px}' +
    '#lxn .bx .m{font-family:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;letter-spacing:.03em;user-select:all}#lxn .bx ul{margin:0;padding-left:18px}' +
    '#lxn .bar{height:5px;border-radius:99px;background:#252336;margin-top:10px;overflow:hidden}#lxn .bar span{display:block;height:100%;border-radius:99px;background:var(--c);transform-origin:left;animation:lxnG 1s .3s cubic-bezier(.2,.8,.2,1) both}' +
    '#lxn .lad{display:flex;gap:4px;margin-top:9px}#lxn .lad span{flex:1;height:5px;border-radius:99px;background:#252336}#lxn .lad span.on{background:color-mix(in srgb,var(--c) 45%,#252336)}#lxn .lad span.now{background:var(--c)}' +
    '#lxn .wn{font-size:12.5px;color:#8d8aa3;line-height:1.65;margin:0 4px 22px;animation:lxnUp .6s .25s cubic-bezier(.2,.8,.2,1) both}' +
    '#lxn .bt{display:flex;flex-direction:column;gap:10px;animation:lxnUp .6s .3s cubic-bezier(.2,.8,.2,1) both}' +
    '#lxn .b1,#lxn .b2{display:flex;align-items:center;justify-content:center;gap:8px;height:46px;border-radius:999px;font:inherit;font-size:14.5px;font-weight:600;text-decoration:none;cursor:pointer;border:1px solid transparent;transition:transform .15s,filter .2s}' +
    '#lxn .b1{background:linear-gradient(135deg,#ff7c1f,#d94fc4 55%,#a35cf5);color:#fff;background-origin:border-box}#lxn .b1:hover{filter:brightness(1.08);transform:translateY(-1px)}' +
    '#lxn .b2{background:transparent;border-color:#2b2838;color:#ece9f5}#lxn .b2:hover{border-color:#433f58}' +
    '#lxn .ap{text-align:left;display:grid;gap:12px;animation:lxnUp .4s cubic-bezier(.2,.8,.2,1) both}#lxn .ap h2{font-size:18px;font-weight:600;margin:4px 0 0}#lxn .ap p{margin:0;font-size:13.5px;color:#a9a6bd;line-height:1.55}' +
    '#lxn .ap label{display:grid;gap:6px;font-size:12.5px;color:#8d8aa3}#lxn .ap label span{color:#6f6c85}#lxn .ap2{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '#lxn .ap input,#lxn .ap textarea{width:100%;background:rgba(255,255,255,.04);border:1px solid #2b2838;border-radius:12px;color:#ece9f5;font:inherit;font-size:14.5px;padding:11px 13px;outline:none;resize:vertical}#lxn .ap input:focus,#lxn .ap textarea:focus{border-color:var(--c)}' +
    '#lxn .aperr{min-height:0;font-size:13px;color:#ff8aa1}#lxn .aperr:empty{display:none}#lxn .apalt{text-align:center;font-size:12.5px;color:#8d8aa3}#lxn .apalt a{color:#ffa365}#lxn .b1:disabled{opacity:.6}' +
    '#lxn .ft{margin-top:22px;font-size:12.5px;color:#8d8aa3;line-height:1.7}#lxn .ft a{color:#ffa365;text-decoration:none}#lxn .ft a:hover{text-decoration:underline}' +
    '#lxn .lgl{margin-top:26px;font:500 11px/1 "Geist Mono",ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#5f5c74}' +
    '#lxn .pv{position:fixed;top:12px;right:12px;z-index:2;font:600 11px/1 "Geist Mono",ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;background:#2a2738;border:1px solid #403b57;color:#c7c4d8;border-radius:6px;padding:8px 10px;cursor:pointer}' +
    '@keyframes lxnF{from{opacity:0}}@keyframes lxnUp{from{opacity:0;transform:translateY(8px)}}@keyframes lxnG{from{transform:scaleX(0)}}' +
    '@media(prefers-reduced-motion:reduce){#lxn,#lxn *{animation:none!important}}';
  function ensureCss() { if (document.getElementById('lxn-css')) return; var s = document.createElement('style'); s.id = 'lxn-css'; s.textContent = css; (document.head || document.documentElement).appendChild(s); }
  var nice = function (iso) { try { return new Date(iso).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return iso; } };
  var left = function (iso) { var d = Math.ceil((Date.parse(iso) - Date.now()) / 86400000); return d <= 1 ? 'tomorrow' : 'in ' + d + ' days'; };
  var cap = function (s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
  function close() { var o = document.getElementById('lxn'); if (o) o.remove(); document.documentElement.style.overflow = ''; }
  function user() { try { return localStorage.getItem('lu') || ''; } catch (e) { return ''; } }
  function show(level, d, preview) {
    var L = LV[level]; if (!L || !document.body) return; d = d || {}; ensureCss(); close();
    var who = d.username || user(), idx = ORDER.indexOf(level);
    var subj = (L.ack ? 'Question about notice ' : 'Appeal ') + (d.ref || '') + (who ? ' (' + who + ')' : '');
    var mail = 'mailto:help@lareon.org?subject=' + encodeURIComponent(subj.replace(/\s+/g, ' ').trim()) + '&body=' + encodeURIComponent('Username: ' + (who || '') + '\nReference: ' + (d.ref || '') + '\n\nWhat happened, in my words:\n');
    var rows = [];
    if (d.reason) rows.push('<small>Reason</small>' + esc(cap(d.reason)));
    if (d.rule) rows.push('<small>Rule</small>' + esc(d.rule));
    if (level === 'restricted' && d.features && d.features.length) rows.push('<small>Switched off</small><ul>' + d.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>');
    if ((level === 'short' || level === 'long' || level === 'restricted') && d.until) {
      var total = Math.max(1, (d.days || 30) * 86400000), done = Math.min(1, Math.max(0, 1 - (Date.parse(d.until) - Date.now()) / total));
      rows.push('<small>' + (level === 'restricted' ? 'Restricted until' : level === 'short' ? 'You can sign in again on' : 'Suspended until') + '</small><b>' + esc(nice(d.until)) + '</b><i>' + esc(left(d.until)) + '</i><div class="bar" aria-hidden="true"><span style="width:' + Math.max(2, Math.round(100 * done)) + '%"></span></div>');
    }
    if (level === 'review') rows.push('<small>Suspended</small><b>Until a person has reviewed it</b>');
    if (level === 'term' && d.delete_at) rows.push('<small>Account and data erased on</small><b>' + esc(nice(d.delete_at)) + '</b>');
    if ((level === 'reminder' || level === 'warning' || level === 'final') && d.at) rows.push('<small>Given on</small><b>' + esc(nice(d.at)) + '</b>');
    if (level === 'network' || level === 'signup') {
      rows.push('<small>Applies to</small>' + (level === 'network' ? 'Everyone using this network (its internet address)' : 'New sign-ups from this network and browser'));
      rows.push('<small>Seen at</small><b>' + esc(new Date().toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })) + '</b>');
    }
    if (level !== 'signup') rows.push('<small>Level ' + (idx + 1) + ' of ' + ORDER.length + (d.ref ? ' · Reference' : '') + '</small>' + (d.ref ? '<span class="m">' + esc(d.ref) + '</span>' : '') + '<div class="lad" aria-hidden="true">' + ORDER.map(function (k, i) { return '<span class="' + (i < idx ? 'on' : i === idx ? 'now' : '') + '"></span>'; }).join('') + '</div>');
    var netMail = 'mailto:help@lareon.org?subject=' + encodeURIComponent(level === 'signup' ? 'Sign-ups paused on my network' : 'My network is blocked') + '&body=' + encodeURIComponent('Time I saw this: ' + new Date().toString() + '\n\nWhere I was (home, school, work…):\n');
    var btns = (level === 'network' || level === 'signup') ? '<a class="b1" href="' + netMail + '">Email us about this</a>' + (level === 'signup' ? '<a class="b2" href="/account">Sign in instead</a>' : '')
      : level === 'reported' ? '<button class="b1" data-appeal="1">Appeal</button><a class="b2" href="https://lareon.org/terms#t16">Read the rules on bans</a>'
      : L.ack ? '<button class="b1" id="lxn-ok">' + esc(L.ack) + '</button><button class="b2" data-appeal="1">Ask about this notice</button>'
      : (level === 'term' && d.export_token ? '<a class="b1" href="' + (preview ? '#' : '/api/banned/export?token=' + encodeURIComponent(d.export_token)) + '" target="_blank" rel="noopener">Download my data</a><button class="b2" data-appeal="1">Appeal this decision</button>'
        : '<button class="b1" data-appeal="1">Appeal this decision</button><a class="b2" href="https://lareon.org/terms#t16">' + (level === 'term' ? 'Read the rules on bans' : 'Read the rules on suspensions') + '</a>');
    var o = document.createElement('div'); o.id = 'lxn'; o.setAttribute('role', 'alertdialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-labelledby', 'lxn-t'); o.style.setProperty('--c', L.c);
    o.innerHTML = (preview ? '<button class="pv" id="lxn-x">Close preview</button>' : '') + '<div class="w"><img class="lg" src="/lareon-icon.svg" alt="Lareon"><div class="bd">' + esc(L.badge) + '</div><h1 id="lxn-t">' + esc(L.title) + '</h1><p class="tx">' + esc(L.text) + '</p>' +
      '<div class="bx">' + rows.map(function (r) { return '<div>' + r + '</div>'; }).join('') + '</div>' +
      '<p class="wn">' + esc(L.warn) + '</p><div class="bt">' + btns + '</div>' +
      '<div class="ft">Questions or appeals: <b style="font-weight:500;color:#ece9f5;user-select:all">help@lareon.org</b><br>A person reads every message.' + (L.ack || level === 'network' || level === 'reported' ? '' : ' <a href="https://lareon.org">Back to Lareon</a>') + '</div><div class="lgl">Lareon · Nation of Larsonia</div></div>';
    o.__lv = level; document.body.appendChild(o); document.documentElement.style.overflow = 'hidden';
    o.scrollTop = 0;
    var x = document.getElementById('lxn-x'); if (x) x.onclick = close;
    o.querySelectorAll('[data-appeal]').forEach(function (b) { b.onclick = function () { appealForm(o, L, d, who, preview, mail); }; });
    var ok = document.getElementById('lxn-ok');
    if (ok) { try { ok.focus({ preventScroll: true }); } catch (e) {} ok.onclick = function () { ok.disabled = true; if (preview || d.again) return close(); seen().then(close, close); }; }
  }
  // The appeal form, inside the notice. It needs the username and the reference number from the notice, so only the
  // person who got the notice can appeal it. If they don't have a reference, the email link stays as a way out.
  function appealForm(o, L, d, who, preview, mail) {
    var bt = o.querySelector('.bt'), wn = o.querySelector('.wn'); if (wn) wn.style.display = 'none';
    var ask = !!L.ack;
    bt.outerHTML = '<form class="ap" novalidate><h2>' + (ask ? 'Ask about this notice' : 'Appeal this decision') + '</h2><p>' + (ask ? 'Tell us what you’d like to know. A person reads every message.' : 'Tell us what happened, in your own words. A person reads every appeal and answers.') + '</p>' +
      '<div class="ap2"><label>Username<input name="u" autocomplete="username" value="' + esc(who || '') + '"></label><label>Reference<input name="r" placeholder="LRN-…" value="' + esc(d.ref || '') + '" autocapitalize="characters"></label></div>' +
      '<label>' + (ask ? 'Your question' : 'What happened') + '<textarea name="m" rows="5" maxlength="3000" placeholder="' + (ask ? 'What would you like to ask?' : 'Explain why you think this was a mistake, or anything we should know.') + '"></textarea></label>' +
      '<label>Email for our reply <span>(optional, in case you can’t sign in)</span><input name="c" type="email" autocomplete="email" placeholder="you@example.com"></label>' +
      '<div class="aperr" role="alert"></div><button class="b1" type="submit">' + (ask ? 'Send question' : 'Send appeal') + '</button><button class="b2" type="button" data-back="1">Back</button>' +
      '<div class="apalt">No reference number? <a href="' + mail + '">Email us instead</a>.</div></form>';
    var f = o.querySelector('.ap'), err = f.querySelector('.aperr');
    f.querySelector('[data-back]').onclick = function () { show(o.__lv, d, preview); };
    setTimeout(function () { try { f.querySelector('textarea').focus({ preventScroll: false }); } catch (e) {} }, 50);
    f.onsubmit = function (e) {
      e.preventDefault(); err.textContent = '';
      if (preview) { err.textContent = 'This is a preview, so nothing is sent.'; return; }
      var body = { username: f.u.value.trim(), ref: f.r.value.trim(), message: f.m.value.trim(), contact: f.c.value.trim() };
      if (!body.username || !body.ref) { err.textContent = 'Fill in your username and the reference number from your notice.'; return; }
      if (body.message.length < 10) { err.textContent = 'Tell us a little more.'; return; }
      var btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Sending…';
      F('/api/appeals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); }).then(function (x) {
        if (!x.ok) { err.textContent = (x.j && x.j.error) || 'That didn’t send. Try again.'; btn.disabled = false; btn.textContent = ask ? 'Send question' : 'Send appeal'; return; }
        f.outerHTML = '<div class="ap sent"><h2>Sent</h2><p>Thank you. A person will read it and answer in your Lareon inbox' + (body.contact ? ' and at ' + esc(body.contact) : '') + '. You don’t need to send it again.</p>' + (ask ? '<button class="b2" type="button" data-back="1">Back</button>' : '') + '</div>';
        var back = o.querySelector('.sent [data-back]'); if (back) back.onclick = function () { show(o.__lv, d, preview); };
      }, function () { err.textContent = 'You seem to be offline. Try again.'; btn.disabled = false; btn.textContent = ask ? 'Send question' : 'Send appeal'; });
    };
  }
  function token() { try { return localStorage.getItem('lt') || ''; } catch (e) { return ''; } }
  var F = window.fetch.bind(window), checking = false, shown = false;
  function seen() { return F('/api/account/notice/seen', { method: 'POST', headers: { Authorization: 'Bearer ' + token() } }); }
  function checkNotice() {
    if (checking || shown || !token()) return; checking = true;
    F('/api/account/notice', { headers: { Authorization: 'Bearer ' + token() } }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      checking = false; if (d && d.notice && LV[d.notice.level]) { shown = true; show(d.notice.level, d.notice); }
    }, function () { checking = false; });
  }
  window.fetch = function (input, init) {
    return F(input, init).then(function (r) {
      try {
        if (r.headers.get('x-lareon-notice')) setTimeout(checkNotice, 0);
        if (r.status === 403 && /\/api\//.test(String(input && input.url || input))) {
          r.clone().json().then(function (d) {
            if (!d) return;
            if (d.code === 'suspended') show(d.level || (d.until ? 'long' : 'review'), d);
            else if (d.code === 'restricted') show('restricted', Object.assign({ again: true }, d));
            else if (d.error === 'banned' && d.reported) show('reported', d);
            else if (d.error === 'banned' && d.reason !== '__under13') show('term', { reason: d.reason, delete_at: d.delete_at, export_token: d.export_token, ref: d.ref, rule: d.rule, username: d.username });
            else if (d.code === 'ip_blocked') show('signup', {});
            else if (d.code === 'network_blocked') show('network', {});
            else if (d.code === 'closed_reported') show('reported', {});
          }, function () {});
        }
      } catch (e) {}
      return r;
    });
  };
  window.lxNotice = { show: show, preview: function (lv) {
    var day = 86400000, now = Date.now(), iso = function (n) { return new Date(now + n * day).toISOString(); };
    var base = { username: 'example', ref: 'LRN-' + iso(0).slice(2, 10).replace(/-/g, '') + '-4F2A9C', at: iso(0) };
    var S = {
      reminder: { rule: 'Terms §14 — No spam or unwanted messages', reason: 'several emails were sent to people who hadn’t asked for them' },
      warning: { rule: 'Terms §14 — No spam or unwanted messages', reason: 'it was used to send spam or unwanted mail' },
      final: { rule: 'Terms §14 — No spam or unwanted messages', reason: 'it was used to send spam again after a formal warning' },
      restricted: { rule: 'Terms §14 — No spam or unwanted messages', reason: 'it was used to send spam or unwanted mail', until: iso(7), days: 7, features: ['Sending email', 'Sharing with links or with other people'] },
      short: { rule: 'Terms §14 — No spam or unwanted messages', reason: 'it was used to send spam or unwanted mail', until: iso(7), days: 7 },
      long: { rule: 'Terms §3 — One person, one account', reason: 'it looks like one of several accounts made by the same person, which our terms don’t allow', until: iso(30), days: 30 },
      review: { rule: 'Terms §14 — No harassment or abuse', reason: 'it was reported for threatening another user' },
      term: { reason: 'it was used to send spam after a suspension', delete_at: iso(30), export_token: 'preview' },
      reported: { reason: 'it was used to threaten to harm people', rule: 'Terms §14 — No threats or harassment' },
      network: {}, signup: {},
    };
    show(lv, Object.assign({}, base, S[lv]), true);
  } };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.getElementById('lxn-x')) close(); });
})();
