// Lareon's sign-in card. Same look as lareon.org, but it talks to Lareon through the app, so no web page is shown.
// Used by the Home screen and by the setup wizard.
(function () {
  var css = '.si{width:100%;max-width:400px;background:#1a1824;border:1px solid #2b2838;border-radius:14px;padding:34px 34px 28px;text-align:left;position:relative;overflow:hidden;box-shadow:0 30px 80px -30px rgba(0,0,0,.7)}' +
    '.si .st{display:none}.si .st.on{display:block;animation:siIn .42s cubic-bezier(.2,.7,.2,1) both}' +
    '@keyframes siIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}' +
    '.si .mark{display:flex;align-items:center;gap:10px;font-size:26px;font-weight:600;letter-spacing:-1.2px;margin-bottom:4px}.si .mark svg{width:30px;height:30px}' +
    '.si .tag{color:#8a87a0;font-size:13px;margin-bottom:26px;line-height:1.5}.si .tag b{color:#ece9f5;font-weight:600}' +
    '.si .fg{margin-bottom:14px}' +
    '.si label{display:block;font-size:11px;font-weight:500;color:#8a87a0;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px}' +
    '.si .fld{display:flex;align-items:center;background:#13111b;border:1px solid #2b2838;border-radius:8px;transition:border-color .15s,box-shadow .2s}' +
    '.si .fld:focus-within{border-color:#ff7c1f;box-shadow:0 0 0 3px rgba(255,124,31,.14)}' +
    '.si input{flex:1;min-width:0;width:100%;font:inherit;font-size:14px;color:#ece9f5;background:none;border:0;outline:0;padding:11px 14px;-webkit-user-select:text;user-select:text}' +
    '.si input.code{font-size:26px;letter-spacing:8px;text-align:center;padding:12px 8px}' +
    '.si .suf{color:#74718a;padding-right:14px;font-size:14px}' +
    '.si .msg{font-size:12.5px;min-height:18px;margin-top:6px;color:#ff4466}' +
    '.si .srow{display:flex;align-items:center;justify-content:space-between;margin-top:16px;gap:12px}' +
    '.si .lnk{color:#ff7c1f;font-size:12.5px;cursor:pointer;background:none;border:0;font:inherit;font-size:12.5px;padding:0}.si .lnk:hover{text-decoration:underline}' +
    '.si .pill{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 24px;border-radius:8px;border:0;font:inherit;font-size:14px;font-weight:500;cursor:pointer;color:#fff;background:linear-gradient(90deg,#ff7c1f,#d94fc4 60%,#a35cf5);transition:transform .12s,filter .2s,box-shadow .2s;min-width:104px}' +
    '.si .pill:hover:not(:disabled){filter:brightness(1.08);box-shadow:0 8px 24px -8px rgba(217,79,196,.6)}.si .pill:active{transform:scale(.97)}.si .pill:disabled{opacity:.5;cursor:default}' +
    '.si .spin{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:siSpin .7s linear infinite;display:none}.si .pill.busy .spin{display:inline-block}' +
    '@keyframes siSpin{to{transform:rotate(360deg)}}' +
    '.si .hint{color:#74718a;font-size:12px;line-height:1.5;margin-top:12px}' +
    '.si .shake{animation:siShake .35s}@keyframes siShake{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}' +
    '@media(prefers-reduced-motion:reduce){.si *{animation:none!important;transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var MARK = function (id) { return '<svg viewBox="0 0 150 150" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7c1f"/><stop offset="1" stop-color="#c84bff"/></linearGradient></defs><path d="M75 28 Q55 45 55 70 Q40 65 25 75 Q42 80 53 90 Q45 105 48 122 Q60 110 68 95 Q70 112 75 128 Q80 112 82 95 Q90 110 102 122 Q105 105 97 90 Q108 80 125 75 Q110 65 95 70 Q95 45 75 28Z" fill="url(#' + id + ')"/></svg>'; };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  window.mountSignin = function (root, opts) {
    opts = opts || {};
    root.innerHTML =
      '<div class="si">' +
      '<form class="st on" id="si-a" novalidate>' +
      '<div class="mark">' + MARK('sga') + 'Lareon</div><div class="tag">Sign in with your Lareon account.</div>' +
      '<div class="fg"><label>Username</label><div class="fld"><input name="u" autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="Your username"><span class="suf">@lareon.org</span></div></div>' +
      '<div class="fg"><label>Password</label><div class="fld"><input name="p" type="password" autocomplete="current-password" placeholder="Your password"></div></div>' +
      '<div class="msg" role="alert"></div>' +
      '<div class="srow"><button class="lnk" type="button" data-x="https://lareon.org/account">Forgot password?</button><button class="pill" type="submit"><span class="spin"></span><span class="t">Sign in</span></button></div>' +
      '<div class="hint">New to Lareon? <button class="lnk" type="button" data-x="https://lareon.org/account#register">Create an account</button></div>' +
      '</form>' +
      '<form class="st" id="si-b" novalidate>' +
      '<div class="mark">' + MARK('sgb') + 'Lareon</div><div class="tag" id="si-say"></div>' +
      '<div class="fg"><label>Verification code</label><div class="fld"><input class="code" name="c" maxlength="12" autocomplete="one-time-code" autocapitalize="off" spellcheck="false" placeholder="000000"></div></div>' +
      '<div class="msg" role="alert"></div>' +
      '<div class="srow"><button class="lnk" type="button" id="si-back">Back</button><button class="pill" type="submit"><span class="spin"></span><span class="t">Verify</span></button></div>' +
      '<div class="hint">Lost your phone? Use one of your backup codes in the same box.</div>' +
      '</form></div>';
    var A = root.querySelector('#si-a'), B = root.querySelector('#si-b'), card = root.querySelector('.si');
    [].forEach.call(root.querySelectorAll('[data-x]'), function (a) { a.onclick = function () { lareon.openExternal(a.getAttribute('data-x')); }; });
    function busy(f, on) { var b = f.querySelector('.pill'); b.disabled = on; b.classList.toggle('busy', on); }
    function fail(f, m) { f.querySelector('.msg').textContent = m || ''; if (m) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); } }
    function go(from, to) { from.classList.remove('on'); to.classList.add('on'); }
    function done(r) { if (opts.onDone) opts.onDone(r.user); }
    A.onsubmit = function (e) {
      e.preventDefault(); fail(A, ''); busy(A, true);
      lareon.login({ username: A.u.value, password: A.p.value }).then(function (r) {
        busy(A, false);
        if (r && r.ok) { A.p.value = ''; return done(r); }
        if (r && r.need2fa) {
          A.p.value = '';
          var say = r.app
            ? 'Enter your sign-in code. Use the code from your authenticator app' + (r.contact ? ', the code we emailed to <b>' + esc(r.contact) + '</b>' : '') + ', or a backup code.'
            : 'We sent a code to <b>' + esc(r.contact || 'your recovery email') + '</b>. Enter it below.';
          root.querySelector('#si-say').innerHTML = say;
          B.c.value = ''; fail(B, ''); go(A, B); setTimeout(function () { B.c.focus(); }, 60); return;
        }
        fail(A, (r && r.error) || 'Could not sign in. Try again.');
      });
    };
    B.onsubmit = function (e) {
      e.preventDefault(); fail(B, ''); busy(B, true);
      lareon.verify2fa(B.c.value).then(function (r) {
        busy(B, false);
        if (r && r.ok) return done(r);
        fail(B, (r && r.error) || 'That code did not work. Try again.');
      });
    };
    root.querySelector('#si-back').onclick = function () { go(B, A); fail(A, ''); setTimeout(function () { A.u.focus(); }, 60); };
    return { focus: function () { setTimeout(function () { B.classList.contains('on') ? B.c.focus() : (A.u.value ? A.p.focus() : A.u.focus()); }, 80); } };
  };
})();
