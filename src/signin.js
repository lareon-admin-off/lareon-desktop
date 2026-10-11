// Lareon's own sign-in form. It talks to Lareon through the app, so no web page is shown.
// Used by the Home screen and by the setup wizard.
(function () {
  var css = '.si{display:grid;gap:14px;max-width:360px;width:100%;text-align:left}' +
    '.si[hidden],.si [hidden]{display:none!important}' +
    '.si label{display:grid;gap:6px;font-size:14px;color:#b9b1bd}' +
    '.si .fld{display:flex;align-items:center;background:#1d1826;border:1.5px solid #352d42;border-radius:12px;transition:border-color .15s}' +
    '.si .fld:focus-within{border-color:#ff8a2b}' +
    '.si input{flex:1;min-width:0;font:inherit;font-size:16px;color:#f3eee8;background:none;border:0;outline:0;padding:12px 14px;-webkit-user-select:text;user-select:text}' +
    '.si .suf{color:#827a8c;padding-right:14px;font-size:15px}' +
    '.si .go{font:inherit;font-weight:600;border:0;border-radius:12px;padding:13px 20px;cursor:pointer;background:linear-gradient(135deg,#ff8a2b,#ff4f7a);color:#fff}' +
    '.si .go:disabled{opacity:.55;cursor:default}' +
    '.si .ghost{font:inherit;color:#b9b1bd;background:none;border:0;cursor:pointer;padding:6px;justify-self:start}' +
    '.si .err{min-height:20px;color:#ff9aa8;font-size:14px}' +
    '.si .alt{margin:0;color:#827a8c;font-size:14px}' +
    '.si .alt a{color:#ffb347;cursor:pointer;text-decoration:none}.si .alt a:hover{text-decoration:underline}' +
    '.si p.say{margin:0;color:#b9b1bd;font-size:15px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  window.mountSignin = function (root, opts) {
    opts = opts || {};
    root.innerHTML =
      '<form class="si" id="si-a" novalidate>' +
      '<label>Lareon username<span class="fld"><input name="u" autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="yourname"><span class="suf">@lareon.org</span></span></label>' +
      '<label>Password<span class="fld"><input name="p" type="password" autocomplete="current-password"></span></label>' +
      '<div class="err" role="alert"></div>' +
      '<button class="go" type="submit">Sign in</button>' +
      '<p class="alt">New to Lareon? <a data-x="https://lareon.org/account#register">Create an account</a> &nbsp;&middot;&nbsp; <a data-x="https://lareon.org/account">Forgot password?</a></p>' +
      '</form>' +
      '<form class="si" id="si-b" novalidate hidden>' +
      '<p class="say"></p>' +
      '<label>Sign-in code<span class="fld"><input name="c" inputmode="text" autocomplete="one-time-code" autocapitalize="off" spellcheck="false" placeholder="123456"></span></label>' +
      '<div class="err" role="alert"></div>' +
      '<button class="go" type="submit">Verify</button>' +
      '<button class="ghost" type="button">Use a different account</button>' +
      '</form>';
    var A = root.querySelector('#si-a'), B = root.querySelector('#si-b');
    [].forEach.call(root.querySelectorAll('[data-x]'), function (a) { a.onclick = function () { lareon.openExternal(a.getAttribute('data-x')); }; });
    function busy(f, on) { f.querySelector('.go').disabled = on; }
    function fail(f, m) { f.querySelector('.err').textContent = m || ''; }
    function done(r) { if (opts.onDone) opts.onDone(r.user); }
    A.onsubmit = function (e) {
      e.preventDefault(); fail(A, ''); busy(A, true);
      lareon.login({ username: A.u.value, password: A.p.value }).then(function (r) {
        busy(A, false);
        if (r && r.ok) { A.p.value = ''; return done(r); }
        if (r && r.need2fa) {
          A.p.value = ''; A.hidden = true; B.hidden = false;
          B.querySelector('.say').textContent = r.app ? 'Open your authenticator app and enter the 6-digit code.' : ('We sent a code to ' + (r.contact || 'your recovery email') + '. Enter it here.');
          B.c.value = ''; B.c.focus(); return;
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
    B.querySelector('.ghost').onclick = function () { B.hidden = true; A.hidden = false; fail(A, ''); A.u.focus(); };
    return { focus: function () { setTimeout(function () { A.hidden ? B.c.focus() : (A.u.value ? A.p.focus() : A.u.focus()); }, 50); } };
  };
})();
