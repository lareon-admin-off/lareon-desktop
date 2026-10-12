// Lareon's account card: sign in, create an account, reset a password. Same look as lareon.org, but it never leaves the app.
(function () {
  var css = '.si{width:100%;max-width:392px;margin:0 auto;text-align:center;position:relative;-webkit-user-select:none;user-select:none}' +
    '.si .st{display:none}.si .st.on{display:block;animation:siIn .5s var(--ease) both}.si .st.back.on{animation-name:siInB}' +
    '@keyframes siIn{from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:none}}@keyframes siInB{from{opacity:0;transform:translateX(-22px)}to{opacity:1;transform:none}}' +
    '.si .logo{width:92px;height:92px;margin:0 auto 18px;display:block;filter:drop-shadow(0 0 26px rgba(200,75,255,.5));transition:transform .5s var(--ease)}.si .st.on:hover .logo{transform:translateY(-2px) scale(1.03)}' +
    '.si h2{font-size:28px;font-weight:600;letter-spacing:-.84px;line-height:1.15;margin-bottom:8px;color:var(--fg)}' +
    '.si .tag{color:var(--fg3);font-size:14px;margin:0 36px 28px;line-height:1.5}.si .tag b{color:var(--fg);font-weight:600}' +
    '.si .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
    '.si .stack{border:1px solid var(--line);border-radius:14px;background:var(--fieldw);overflow:hidden;text-align:left;transition:border-color .2s,box-shadow .25s;margin-bottom:12px}.si .stack:focus-within{border-color:var(--orange);box-shadow:0 0 0 3px rgba(255,124,31,.14)}.si .stack.bad{border-color:var(--red)}' +
    '.si .fld{display:flex;align-items:center;position:relative;min-height:54px}.si .fld+.fld{border-top:1px solid var(--line)}' +
    '.si input,.si select{flex:1;min-width:0;width:100%;height:54px;font:inherit;font-size:16px;color:var(--fg);background:none;border:0;outline:0;padding:0 18px;-webkit-user-select:text;user-select:text}.si input::placeholder{color:var(--fg3)}' +
    '.si select{cursor:pointer;-webkit-appearance:none;appearance:none}.si select option{background:var(--solid);color:var(--fg)}' +
    '.si .two{display:flex}.si .two .fld{flex:1}.si .two .fld+.fld{border-top:0;border-left:1px solid var(--line)}' +
    '.si input.code{font-size:26px;letter-spacing:8px;text-align:center;padding:0 8px}' +
    '.si .suf{color:var(--fg3);padding-right:18px;font-size:15px;white-space:nowrap}' +
    '.si .eye{background:none;border:0;color:var(--fg3);padding:0 10px;height:54px;display:grid;place-items:center}.si .eye:hover{color:var(--fg)}.si .eye svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}' +
    '.si .go{width:34px;height:34px;border-radius:50%;border:0;margin-right:10px;flex:none;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#ff7c1f,#d94fc4 60%,#a35cf5);transition:transform .15s,filter .15s}.si .go:hover{filter:brightness(1.1)}.si .go:active{transform:scale(.93)}.si .go svg{width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
    '.si .go .spin{display:none;width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:siSpin .7s linear infinite}.si .go.busy svg{display:none}.si .go.busy .spin{display:block}.si .go:disabled{opacity:.6;cursor:default}' +
    '.si .msg{font-size:13px;min-height:20px;margin:12px 0 4px;color:var(--red);text-align:center}.si .msg.ok{color:var(--green)}' +
    '.si .lnk{color:var(--orange);font-size:13.5px;cursor:pointer;background:none;border:0;padding:0}.si .lnk:hover{text-decoration:underline}' +
    '.si .links{display:flex;flex-direction:column;gap:10px;margin-top:10px;font-size:13.5px;color:var(--fg3)}' +
    '.si .pill{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px 20px;border-radius:12px;border:0;font-size:15px;font-weight:500;color:#fff;background:var(--grad);transition:transform .12s,filter .2s,box-shadow .25s}' +
    '.si .pill:hover:not(:disabled){filter:brightness(1.08);box-shadow:0 10px 26px -10px rgba(217,79,196,.7)}.si .pill:active{transform:scale(.98)}.si .pill:disabled{opacity:.4;cursor:default}' +
    '.si .spin{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:siSpin .7s linear infinite;display:none}.si .pill.busy .spin{display:inline-block}@keyframes siSpin{to{transform:rotate(360deg)}}' +
    '.si .apps{display:flex;justify-content:center;gap:8px;margin:30px 0 0;flex-wrap:wrap}.si .apps span{font-size:12px;color:var(--fg3);border:1px solid var(--line);border-radius:999px;padding:5px 12px;background:var(--hover)}' +
    '.si .legal{margin-top:18px;font-size:11.5px;color:var(--fg3)}' +
    '.si .hint{color:var(--fg3);font-size:12.5px;line-height:1.55;margin:4px 0 10px}' +
    '.si .chk{display:flex;gap:10px;align-items:flex-start;justify-content:center;font-size:13px;color:var(--fg2);margin:8px 0 4px;cursor:pointer;text-align:left}.si .chk input{width:16px;height:16px;flex:none;margin-top:2px;padding:0;accent-color:var(--orange)}' +
    '.si .tos{height:150px;overflow:auto;text-align:left;background:var(--field);border:1px solid var(--line);border-radius:14px;padding:12px 16px;font-size:12.5px;line-height:1.6;color:var(--fg2);-webkit-user-select:text;user-select:text;margin-bottom:12px}.si .tos p{margin-bottom:9px}.si .tos h3{font-size:13px;color:var(--fg);margin:10px 0 4px}' +
    '.si .steps{display:flex;gap:6px;margin:0 0 18px}.si .steps i{height:3px;flex:1;border-radius:2px;background:var(--line2);transition:background .3s}.si .steps i.on{background:var(--grad)}' +
    '.si .shake{animation:siShake .35s}@keyframes siShake{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}' +
    '@media(prefers-reduced-motion:reduce){.si *{animation:none!important;transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var MARK = function (id) { return '<svg viewBox="0 0 150 150" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7c1f"/><stop offset="1" stop-color="#c84bff"/></linearGradient></defs><path d="M75 28 Q55 45 55 70 Q40 65 25 75 Q42 80 53 90 Q45 105 48 122 Q60 110 68 95 Q70 112 75 128 Q80 112 82 95 Q90 110 102 122 Q105 105 97 90 Q108 80 125 75 Q110 65 95 70 Q95 45 75 28Z" fill="url(#' + id + ')"/></svg>'; };
  var EYE = '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var T = function (k, v) { return window.i18n.t(k, v); };
  var uid = 0;
  function E(r) { if (!r) return ''; if (r.code === 'region') return T('err.region'); if (r.code === 'maint') return T('err.maint'); if (r.code === 'net') return T('err.net'); return r.error || ''; }

  var ARROW = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function fld(label, inner, extra) { return '<div class="fld"><label class="sr" data-i="' + label + '"></label>' + inner + (extra || '') + '</div>'; }
  function pwf(name, auto, ph, go) { return fld('su.pass', '<input name="' + name + '" type="password" autocomplete="' + auto + '" data-ip="' + ph + '"><button class="eye" type="button" tabindex="-1" aria-label="Show password">' + EYE + '</button>' + (go ? '<button class="go" type="submit" aria-label="Sign in"><span class="spin"></span>' + ARROW + '</button>' : '')); }
  function months() { var o = '<option value="" data-i="su.month"></option>', d = new Date(2000, 0, 1); for (var i = 0; i < 12; i++) { d.setMonth(i); o += '<option value="' + (i + 1) + '">' + esc(d.toLocaleDateString(window.i18n.lang, { month: 'long' })) + '</option>'; } return o; }
  var LOGO = function (id) { return '<div class="logo">' + MARK(id) + '</div>'; };
  function btn(label, cls) { return '<button class="pill" type="submit"><span class="spin"></span><span data-i="' + label + '"></span></button>'; }
  function back(to, key) { return '<div class="links"><button class="lnk" type="button" data-go="' + to + '" data-back data-i="' + (key || 'btn.back') + '"></button></div>'; }

  window.mountSignin = function (root, opts) {
    opts = opts || {};
    var n = ++uid;
    root.innerHTML = '<div class="si">' +
      // sign in
      '<form class="st on" data-p="in" novalidate>' + LOGO('sg' + n + 'a') + '<h2 data-i="si.title"></h2><div class="tag" data-i="si.tag"></div>' +
      '<div class="stack">' + fld('si.user', '<input name="u" autocomplete="username" autocapitalize="off" spellcheck="false" data-ip="si.user">') + pwf('p', 'current-password', 'si.pass', true) + '</div>' +
      '<div class="msg" role="alert"></div>' +
      '<div class="links"><button class="lnk" type="button" data-go="reset" data-i="si.forgot"></button><span><span data-i="si.new"></span> <button class="lnk" type="button" data-go="su1" data-i="si.create"></button></span></div>' +
      '<div class="apps"><span>Fledge</span><span>Ember</span><span>Larsonian ID</span></div><div class="legal">Lareon &middot; Nation of Larsonia</div></form>' +
      // two-step code
      '<form class="st" data-p="code" novalidate>' + LOGO('sg' + n + 'b') + '<h2 data-i="cd.title"></h2><div class="tag" data-say></div>' +
      '<div class="stack">' + fld('cd.label', '<input class="code" name="c" maxlength="12" autocomplete="one-time-code" autocapitalize="off" spellcheck="false" placeholder="000000">') + '</div>' +
      '<label class="chk"><input type="checkbox" name="trust" checked><span data-i="cd.trust"></span></label><div class="msg" role="alert"></div>' + btn('cd.btn') +
      '<div class="hint" style="margin-top:14px" data-i="cd.lost"></div>' + back('in') + '</form>' +
      // sign up 1
      '<form class="st" data-p="su1" novalidate>' + LOGO('sg' + n + 'f') + '<div class="steps"><i class="on"></i><i></i><i></i></div><h2 data-i="su.title"></h2><div class="tag" data-i="su.tag"></div>' +
      '<div class="stack">' + fld('su.name', '<input name="name" autocomplete="name" data-ip="su.nameph" maxlength="60">') + fld('su.user', '<input name="u" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="30" data-ip="su.user">', '<span class="suf">@lareon.org</span>') + pwf('p', 'new-password', 'su.passph') + '</div>' +
      '<div class="msg" role="alert"></div>' + btn('su.next') + '<div class="links"><span><span data-i="su.have"></span> <button class="lnk" type="button" data-go="in" data-back data-i="su.signin"></button></span></div></form>' +
      // sign up 2
      '<form class="st" data-p="su2" novalidate><div class="steps"><i class="on"></i><i class="on"></i><i></i></div><h2 data-i="su.dob"></h2><div class="tag" data-i="su.dobwhy"></div>' +
      '<div class="stack"><div class="two"><div class="fld"><label class="sr" data-i="su.month"></label><select name="bm">' + months() + '</select></div><div class="fld"><label class="sr" data-i="su.year"></label><input name="by" inputmode="numeric" maxlength="4" autocomplete="bday-year" data-ip="su.year"></div></div></div>' +
      '<div data-emailbox><div class="stack">' + fld('su.email', '<input name="e" type="email" autocomplete="email" data-ip="su.email">') + '</div><div class="hint" data-i="su.emailwhy"></div></div>' +
      '<div class="hint" data-nobox hidden data-i="su.noemailnote"></div><button class="lnk" type="button" data-noemail></button><div class="msg" role="alert"></div>' + btn('su.next') + back('su1') + '</form>' +
      // sign up 3: terms
      '<form class="st" data-p="su3" novalidate><div class="steps"><i class="on"></i><i class="on"></i><i class="on"></i></div><h2 data-i="su.terms"></h2><div class="tag" data-i="su.readall"></div>' +
      '<div class="tos" tabindex="0"></div><label class="chk"><input type="checkbox" name="agree" disabled><span data-i="su.agree"></span></label><div class="msg" role="alert"></div>' + btn('su.create') + back('su2') + '</form>' +
      // sign up code
      '<form class="st" data-p="sucode" novalidate>' + LOGO('sg' + n + 'c') + '<h2 data-i="su.vtitle"></h2><div class="tag" data-say></div>' +
      '<div class="stack">' + fld('cd.label', '<input class="code" name="c" maxlength="8" autocomplete="one-time-code" placeholder="000000">') + '</div><div class="msg" role="alert"></div>' + btn('su.create') + back('su2') + '</form>' +
      // reset 1
      '<form class="st" data-p="reset" novalidate>' + LOGO('sg' + n + 'd') + '<h2 data-i="rs.title"></h2><div class="tag" data-i="rs.tag"></div>' +
      '<div class="stack">' + fld('si.user', '<input name="u" autocomplete="username" autocapitalize="off" spellcheck="false" data-ip="si.user">', '<span class="suf">@lareon.org</span>') + '</div><div class="msg" role="alert"></div>' + btn('rs.send') +
      '<div class="links"><button class="lnk" type="button" data-backup data-i="rs.backup"></button><button class="lnk" type="button" data-go="in" data-back data-i="rs.back"></button></div></form>' +
      // reset 2
      '<form class="st" data-p="reset2" novalidate>' + LOGO('sg' + n + 'e') + '<h2 data-i="rs.title"></h2><div class="tag" data-say></div>' +
      '<div class="stack">' + fld('rs.code', '<input name="c" autocomplete="one-time-code" autocapitalize="off" spellcheck="false" maxlength="14" data-ip="rs.code">') + fld('rs.new', '<input name="p" type="password" autocomplete="new-password" data-ip="rs.new"><button class="eye" type="button" tabindex="-1" aria-label="Show password">' + EYE + '</button>') + '</div><div class="msg" role="alert"></div>' + btn('rs.btn') + back('reset') + '</form>' +
      '</div>';
    window.i18n.apply(root);

    var card = root.querySelector('.si'), P = {};
    [].forEach.call(root.querySelectorAll('.st'), function (f) { P[f.getAttribute('data-p')] = f; });
    var S = { username: '', noEmail: false, email: '', backup: false, signup: null, legalOk: false };
    function go(name, back) {
      var to = P[name]; if (!to) return;
      [].forEach.call(root.querySelectorAll('.st.on'), function (f) { f.classList.remove('on'); });
      to.classList.toggle('back', !!back); to.classList.remove('on'); void to.offsetWidth; to.classList.add('on');
      setTimeout(function () { var i = to.querySelector('input:not([type=checkbox]),select'); if (i && name !== 'su3') i.focus(); }, 90);
      if (name === 'su3') loadTerms();
      if (name === 'su2') noemailUI();
    }
    function busy(f, on) { var b = f.querySelector('.pill,.go'); if (b) { b.disabled = on; b.classList.toggle('busy', on); } }
    function fail(f, m) { var e = f.querySelector('.msg'); e.className = 'msg'; e.textContent = m || ''; if (m) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); } }
    function done(r) { if (opts.onDone) opts.onDone(r.user); }
    [].forEach.call(root.querySelectorAll('[data-go]'), function (b) { b.onclick = function () { go(b.getAttribute('data-go'), b.hasAttribute('data-back')); }; });
    [].forEach.call(root.querySelectorAll('.eye'), function (b) { b.onclick = function () { var i = b.parentNode.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; }; });
    function username(v) { return String(v || '').trim().toLowerCase().replace(/@lareon\.org$/, ''); }

    // sign in
    P.in.onsubmit = function (e) {
      e.preventDefault(); var f = P.in; fail(f, ''); busy(f, true);
      var creds = { username: f.u.value, password: f.p.value };
      lareon.login(creds).then(function (r) {
        busy(f, false);
        if (r && r.ok) { f.p.value = ''; return done(r); }
        if (r && r.need2fa) {
          S.username = username(f.u.value); f.p.value = '';
          P.code.querySelector('[data-say]').innerHTML = r.app ? T('cd.app', { m: r.contact ? T('cd.appmail', { c: '<b>' + esc(r.contact) + '</b>' }) : '' }) : T('cd.mail', { c: '<b>' + esc(r.contact || '') + '</b>' });
          P.code.c.value = ''; fail(P.code, ''); return go('code');
        }
        fail(f, E(r) || T('si.err.fail'));
      });
    };
    P.code.onsubmit = function (e) {
      e.preventDefault(); var f = P.code; fail(f, ''); busy(f, true);
      lareon.verify2fa({ code: f.c.value, trust: f.trust.checked }).then(function (r) {
        busy(f, false); if (r && r.ok) return done(r); fail(f, E(r) || T('cd.err'));
      });
    };

    // sign up
    var chk = 0;
    P.su1.u.oninput = function () { P.su1.u.closest('.stack').classList.remove('bad'); };
    P.su1.onsubmit = function (e) {
      e.preventDefault(); var f = P.su1; fail(f, '');
      var u = username(f.u.value), p = f.p.value;
      if (!u || !p || !f.name.value.trim()) return fail(f, T('su.err.fill'));
      if (p.length < 6) return fail(f, T('su.err.short'));
      busy(f, true);
      lareon.checkUsername(u).then(function (r) {
        busy(f, false);
        if (r && r.ok === false) { f.u.closest('.stack').classList.add('bad'); return fail(f, r.reason || T('su.err.taken')); }
        S.signup = { username: u, password: p, displayName: f.name.value.trim() }; go('su2');
      });
    };
    function noemailUI() {
      var f = P.su2; f.querySelector('[data-emailbox]').hidden = S.noEmail; f.querySelector('[data-nobox]').hidden = !S.noEmail;
      f.querySelector('[data-noemail]').textContent = T(S.noEmail ? 'su.useemail' : 'su.noemail');
    }
    P.su2.querySelector('[data-noemail]').onclick = function () { S.noEmail = !S.noEmail; noemailUI(); };
    P.su2.onsubmit = function (e) {
      e.preventDefault(); var f = P.su2; fail(f, '');
      var m = parseInt(f.bm.value, 10), y = parseInt(f.by.value, 10), now = new Date(), ny = now.getFullYear(), nm = now.getMonth() + 1;
      if (!m || !y || y < 1900 || y > ny) return fail(f, T('su.err.dob'));
      if ((ny - y) * 12 + (nm - m) < 156) return fail(f, T('su.under'));
      if (!S.noEmail && !f.e.value.trim()) return fail(f, T('su.err.email'));
      S.signup.birth = { month: m, year: y }; S.signup.email = S.noEmail ? '' : f.e.value.trim(); S.signup.noEmail = S.noEmail; go('su3');
    };
    var tosBox = P.su3.querySelector('.tos');
    function tosCheck() { if (tosBox.scrollTop + tosBox.clientHeight >= tosBox.scrollHeight - 8 && S.legalOk) { P.su3.agree.disabled = false; P.su3.querySelector('[data-i="su.readall"]') && (P.su3.querySelector('.tag').style.visibility = 'hidden'); } }
    tosBox.onscroll = tosCheck;
    function loadTerms() {
      P.su3.agree.checked = false; P.su3.agree.disabled = true; P.su3.querySelector('.pill').disabled = true; P.su3.querySelector('.tag').style.visibility = 'visible'; fail(P.su3, '');
      if (S.legalLoaded) { setTimeout(tosCheck, 50); return; }
      tosBox.textContent = '…';
      lareon.legal('terms').then(function (txt) {
        if (!txt) { tosBox.textContent = T('offline'); S.legalOk = false; return; }
        tosBox.innerHTML = txt.split(/\n{2,}/).map(function (p) { p = p.trim(); return p.length < 70 && !/[.:]$/.test(p) ? '<h3>' + esc(p) + '</h3>' : '<p>' + esc(p) + '</p>'; }).join('');
        S.legalOk = true; S.legalLoaded = true; tosBox.scrollTop = 0; setTimeout(tosCheck, 50);
      });
    }
    P.su3.agree.onchange = function () { P.su3.querySelector('.pill').disabled = !P.su3.agree.checked; };
    function register(f, code) {
      busy(f, true);
      var d = S.signup; lareon.register({ username: d.username, password: d.password, displayName: d.displayName, email: d.email, noEmail: d.noEmail, birth: d.birth, code: code || '' }).then(function (r) {
        busy(f, false);
        if (r && r.ok) return done(r);
        if (r && r.needs_code) { P.sucode.querySelector('[data-say]').innerHTML = T('su.vmsg', { e: '<b>' + esc(d.email) + '</b>' }); P.sucode.c.value = ''; fail(P.sucode, ''); return go('sucode'); }
        if (r && r.code === 'under13') { go('su2', true); return fail(P.su2, T('su.under')); }
        if (r && r.field === 'email') { go('su2', true); return fail(P.su2, E(r)); }
        if (r && r.field === 'username') { go('su1', true); return fail(P.su1, E(r)); }
        fail(f, E(r) || T('si.err.fail'));
      });
    }
    P.su3.onsubmit = function (e) { e.preventDefault(); if (!P.su3.agree.checked) return; register(P.su3, ''); };
    P.sucode.onsubmit = function (e) { e.preventDefault(); register(P.sucode, P.sucode.c.value.trim()); };

    // reset password
    P.reset.querySelector('[data-backup]').onclick = function () {
      var u = username(P.reset.u.value); if (!u) return fail(P.reset, T('rs.err.fill'));
      S.username = u; S.backup = true; P.reset2.querySelector('[data-say]').textContent = T('cd.lost'); P.reset2.c.value = ''; P.reset2.p.value = ''; fail(P.reset2, ''); go('reset2');
    };
    P.reset.onsubmit = function (e) {
      e.preventDefault(); var f = P.reset, u = username(f.u.value); fail(f, ''); if (!u) return fail(f, T('rs.err.fill'));
      busy(f, true);
      lareon.resetRequest(u).then(function (r) {
        busy(f, false); if (!r || r.error) return fail(f, E(r) || T('si.err.fail'));
        S.username = u; S.backup = false; P.reset2.querySelector('[data-say]').innerHTML = T('rs.sent', { c: '<b>' + esc(r.contact || '') + '</b>' }); P.reset2.c.value = ''; P.reset2.p.value = ''; fail(P.reset2, ''); go('reset2');
      });
    };
    P.reset2.onsubmit = function (e) {
      e.preventDefault(); var f = P.reset2; fail(f, ''); var c = f.c.value.trim(), p = f.p.value;
      if (!c || !p) return fail(f, T('rs.err.fill')); if (p.length < 6) return fail(f, T('su.err.short'));
      busy(f, true);
      lareon.resetVerify({ username: S.username, code: c, newPassword: p, backup: S.backup }).then(function (r) {
        if (!r || r.error) { busy(f, false); return fail(f, E(r) || T('si.err.fail')); }
        return lareon.login({ username: S.username, password: p }).then(function (l) {
          busy(f, false);
          if (l && l.ok) return done(l);
          if (l && l.need2fa) { P.code.querySelector('[data-say]').innerHTML = l.app ? T('cd.app', { m: '' }) : T('cd.mail', { c: '<b>' + esc(l.contact || '') + '</b>' }); P.code.c.value = ''; return go('code'); }
          go('in'); fail(P.in, E(l) || '');
        });
      });
    };
    window.i18n.onChange(function () { noemailUI(); var s = P.su2.bm.value; var i = P.su2.bm; i.innerHTML = months(); window.i18n.apply(i); i.value = s; });
    noemailUI();
    return {
      focus: function () { setTimeout(function () { var on = root.querySelector('.st.on'); var i = on && on.querySelector('input:not([type=checkbox]),select'); if (i) { if (on === P.in && P.in.u.value) P.in.p.focus(); else i.focus(); } }, 90); },
      show: function (name) { go(name); }
    };
  };
})();
