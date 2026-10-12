const { app, BrowserWindow, Tray, globalShortcut, nativeImage, WebContentsView, shell, Menu, session, ipcMain, Notification, nativeTheme, safeStorage, net, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const apps = require('./apps.json');
const EXTRA = { account: { name: 'Account', url: 'https://lareon.org/account', ua: 'LareonApp' }, help: { name: 'Help', url: 'https://lareon.org/help.html', ua: 'LareonApp' } };
const appOf = (k) => apps[k] || EXTRA[k];

app.setName('Lareon');
try { app.setAppUserModelId('org.lareon.desktop'); } catch {}
const BAR = 44;
const API = 'https://lareon.org';
const ALLOWED = (h) => h === 'lareon.org' || h.endsWith('.lareon.org');
const hostOf = (u) => { try { return new URL(u).hostname; } catch { return ''; } };
const isMac = process.platform === 'darwin';
const external = (u) => { if (/^https?:\/\//.test(u) || u === 'mailto:help@lareon.org') shell.openExternal(u); };

if (!app.requestSingleInstanceLock()) app.quit();

// ---- settings (chosen in the setup wizard) ----
const DEFAULTS = { setupDone: false, apps: { dusk: true, fledge: true, aster: true }, notifications: true, remindEvents: true, remindLead: 5, snoozeUntil: 0, startApp: 'home', lastApp: 'home', badge: true, autoUpdate: true, notifSound: true, background: true, quickAdd: true, lastSeen: '', taskQueue: [], launchAtLogin: false, theme: 'system', sess: null, lang: '', td: '' };
const settingsFile = () => path.join(app.getPath('userData'), 'settings.json');
let settings = { ...DEFAULTS };
function loadSettings() {
  try { settings = { ...DEFAULTS, ...JSON.parse(fs.readFileSync(settingsFile(), 'utf8')) }; } catch { settings = { ...DEFAULTS }; }
  settings.apps = { ...DEFAULTS.apps, ...(settings.apps || {}) };
}
const writeSettings = () => { try { fs.writeFileSync(settingsFile(), JSON.stringify(settings), { mode: 0o600 }); } catch {} };
const enabledKeys = () => Object.keys(apps).filter((k) => settings.apps[k] !== false);
function applyLogin() { try { app.setLoginItemSettings({ openAtLogin: !!settings.launchAtLogin }); } catch {} }

// ---- the signed-in Lareon account (kept encrypted when the computer supports it) ----
let sess = null; // { token, user }
function loadSess() {
  try {
    const r = settings.sess; if (!r) return;
    const j = r.e ? JSON.parse(safeStorage.decryptString(Buffer.from(r.e, 'base64'))) : r.p;
    if (j && j.token && j.user) sess = j;
  } catch { sess = null; }
}
function saveSess() {
  if (!sess) delete settings.sess;
  else settings.sess = safeStorage.isEncryptionAvailable() ? { e: safeStorage.encryptString(JSON.stringify(sess)).toString('base64') } : { p: sess };
  writeSettings();
}
const nameOf = (u) => (u && (u.display_name || u.username)) || '';
const sessInfo = () => (sess ? { name: nameOf(sess.user), username: (sess.user && sess.user.username) || '' } : null);
async function api(p, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = 'Bearer ' + token;
  const r = await net.fetch(API + p, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch {}
  if (r.status === 451 || (j && j.code === 'region')) j = { ...(j || {}), code: 'region' };
  else if (r.status === 503) j = { ...(j || {}), code: 'maint' };
  return { status: r.status, j };
}

const dark = () => nativeTheme.shouldUseDarkColors;
const BG = () => (dark() ? '#13111b' : '#f3effa');
const SYM = () => (dark() ? '#f3eee8' : '#1d1832');
function paintChrome() {
  if (!win || win.isDestroyed()) return;
  try { win.setBackgroundColor(BG()); } catch {}
  if (!isMac) { try { win.setTitleBarOverlay({ color: BG(), symbolColor: SYM(), height: BAR }); } catch {} }
  for (const v of Object.values(views)) { try { v.setBackgroundColor(BG()); } catch {} }
}
nativeTheme.on('updated', paintChrome);

let win, current = null, inSetup = false, pending2fa = null;
const views = {};
const stateFile = () => path.join(app.getPath('userData'), 'window.json');
const loadState = () => { try { return JSON.parse(fs.readFileSync(stateFile(), 'utf8')); } catch { return {}; } };
function saveState() {
  if (!win || win.isDestroyed()) return;
  try { fs.writeFileSync(stateFile(), JSON.stringify({ ...win.getNormalBounds(), max: win.isMaximized() })); } catch {}
}
const send = (ch, v) => { if (win && !win.isDestroyed()) win.webContents.send(ch, v); };

function layout() {
  if (!win || win.isDestroyed() || inSetup) return;
  const [w, h] = win.getContentSize();
  for (const v of Object.values(views)) v.setBounds({ x: 0, y: BAR, width: w, height: Math.max(0, h - BAR) });
}

// ---- the product sites (Dusk, Fledge, Aster), each in its own view ----
// A link back to the website's sign-in page means the session ended: go to Lareon's own sign-in instead.
const isBounce = (u) => { try { const x = new URL(u); return x.hostname === 'lareon.org' && /^\/(account|login)/.test(x.pathname) && x.searchParams.has('continue'); } catch { return false; } };
function dropViews() {
  for (const k of Object.keys(views)) { try { win.contentView.removeChildView(views[k]); views[k].webContents.close(); } catch {} delete views[k]; }
}
let lastFix = 0;
async function bounced(key) {
  // a page asked for the website sign-in: only end the session if the server really says it is over
  try {
    const r = await api('/api/account/summary', { token: sess && sess.token });
    if (r.status === 401) return endSession('Your session ended. Sign in again.');
  } catch { return; }
  const v = views[key]; if (v && Date.now() - lastFix > 8000) { lastFix = Date.now(); try { v.webContents.reload(); } catch {} }
}
function endSession(note) {
  seen.mailTop = null; seen.unread = null;
  sess = null; saveSess(); dropViews();
  send('session', null);
  showHome(note);
}
function makeView(key) {
  const A = appOf(key);
  const v = new WebContentsView({ webPreferences: { partition: 'persist:lareon', preload: path.join(__dirname, 'preload-view.js'), contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: true } });
  const wc = v.webContents;
  wc.setUserAgent(wc.getUserAgent().replace(/ Electron\/\S+/, '').replace(/ lareon-desktop\/\S+/, '') + ' ' + A.ua);
  wc.setWindowOpenHandler(({ url: u }) => {
    if (isBounce(u)) { bounced(key); return { action: 'deny' }; }
    if (key !== 'account' && key !== 'help' && ALLOWED(hostOf(u)) && hostOf(u) !== 'lareon.org') return { action: 'allow' };
    external(u); return { action: 'deny' };
  });
  wc.on('will-navigate', (e, u) => {
    if (isBounce(u)) { e.preventDefault(); bounced(key); return; }
    if (key === 'account' || key === 'help' ? hostOf(u) !== 'lareon.org' : (!ALLOWED(hostOf(u)) || hostOf(u) === 'lareon.org')) { e.preventDefault(); external(u); }
  });
  v._ready = false;
  const ready = () => { if (v._ready) return; v._ready = true; send('loading', { key, on: false }); if (current === key) reveal(key); };
  wc.on('did-start-loading', () => { if (!v._ready) send('loading', { key, on: true }); });
  wc.on('did-fail-load', ready);
  setTimeout(ready, 9000);
  wc.on('did-fail-load', (_e, code, _d, u, isMain) => {
    if (isMain && code !== -3) wc.loadFile(path.join(__dirname, 'error.html'), { query: { code: 'offline', app: A.name, url: A.url } });
  });
  // a page that answers with an error gets Lareon's own error screen
  wc.on('did-frame-navigate', (_e, u, status, _t, isMain) => {
    if (isMain && /^https?:/.test(u) && [400, 401, 403, 404, 405, 408, 410, 413, 429, 451, 500, 502, 503, 504].includes(status)) wc.loadFile(path.join(__dirname, 'error.html'), { query: { code: String(status), app: A.name, url: u } });
  });
  // the token is placed in the page before its scripts run (preload-view.js), so there is nothing to reload
  let synced = true;
  wc.on('did-finish-load', () => ready());
  if (key === 'account') { const t = setInterval(() => { if (wc.isDestroyed()) return clearInterval(t); if (!sess) return; wc.executeJavaScript('localStorage.getItem("lt")').then((x) => { if (!x && sess) bounced('account'); }).catch(() => {}); }, 4000); }
  wc.loadURL(A.url);
  v.setBackgroundColor(BG());
  v.setVisible(false);
  win.contentView.addChildView(v);
  return v;
}
function showHome(note) {
  if (!win) return;
  current = 'home';
  for (const v of Object.values(views)) v.setVisible(false);
  win.setTitle('Lareon');
  send('shown', 'home');
  if (note) send('note', note);
  win.webContents.focus();
}
function reveal(key) {
  if (current !== key || !views[key]) return;
  layout();
  for (const [k, v] of Object.entries(views)) v.setVisible(k === key);
  views[key].webContents.focus();
}
function show(key) {
  if (!win) return;
  if (key === 'home' || !appOf(key)) return showHome();
  if (!sess && key !== 'help') return showHome('Sign in to open ' + appOf(key).name + '.');
  if (!views[key]) views[key] = makeView(key);
  current = key;
  if (key !== 'help' && key !== 'account') { settings.lastApp = key; writeSettings(); }
  win.setTitle('Lareon');
  for (const v of Object.values(views)) v.setVisible(false);
  send('shown', key);
  if (views[key]._ready) reveal(key); else send('loading', { key, on: true });
}

// ---- sign in (Lareon's own screen; talks to Lareon directly) ----
async function finishLogin(token, user) {
  seen.mailTop = null; seen.unread = null;
  sess = { token, user };
  saveSess();
  dropViews();
  for (const k of enabledKeys()) views[k] = makeView(k); // load quietly so every app is ready and signed in
  send('session', sessInfo());
  return { ok: true, user: sessInfo() };
}
ipcMain.on('view:token', (e) => {
  let ok = false; try { ok = !!sess && ALLOWED(hostOf(e.senderFrame.url)); } catch {}
  e.returnValue = ok ? { t: sess.token, u: JSON.stringify(sess.user) } : null;
});
ipcMain.handle('auth:session', () => sessInfo());
ipcMain.handle('auth:login', async (_e, c) => {
  const username = String((c && c.username) || '').trim().toLowerCase().replace(/@lareon\.org$/, '');
  const password = String((c && c.password) || '');
  if (!username || !password) return { error: 'Enter your username and password.' };
  try {
    const { status, j } = await api('/api/login', { method: 'POST', body: { username, password, device: settings.td || '' } });
    if (j && (j.code === 'region' || j.code === 'maint')) return { code: j.code };
    if (j && j.token) return finishLogin(j.token, j.user);
    if (j && j.requires2FA) { pending2fa = username; return { need2fa: true, contact: j.contact || '', app: !!j.app }; }
    if (status === 403 && j && j.error === 'banned') return { error: 'This account is not available. Write to help@lareon.org.' };
    if (status === 429) return { error: 'Too many attempts. Wait a few minutes and try again.' };
    return { error: (j && j.error) || 'Could not sign in. Try again.' };
  } catch { return { code: 'net' }; }
});
ipcMain.handle('auth:verify', async (_e, c) => {
  if (!pending2fa) return { error: 'Start again from the sign-in screen.' };
  const code = typeof c === 'string' ? c : (c && c.code);
  try {
    const { j } = await api('/api/auth/2fa/verify', { method: 'POST', body: { username: pending2fa, code: String(code || '').trim() } });
    if (j && j.token) {
      const user = pending2fa; pending2fa = null;
      if (c && c.trust && j.trust_pending) {
        try { const t = await api('/api/auth/trust-device', { method: 'POST', body: { username: user, days: 30, pending: j.trust_pending } }); if (t.j && t.j.device) { settings.td = t.j.device; writeSettings(); } } catch {}
      }
      return finishLogin(j.token, j.user);
    }
    return { error: (j && j.error) || 'That code did not work. Try again.' };
  } catch { return { code: 'net' }; }
});
const clean = (u) => String(u || '').trim().toLowerCase().replace(/@lareon\.org$/, '');
ipcMain.handle('auth:check-username', async (_e, u) => {
  try { const { j } = await api('/api/username-available?u=' + encodeURIComponent(clean(u))); return j || { ok: true }; } catch { return { ok: true }; }
});
ipcMain.handle('auth:register', async (_e, d) => {
  d = d || {};
  const username = clean(d.username), password = String(d.password || '');
  try {
    const { status, j } = await api('/api/register', { method: 'POST', body: { username, password, displayName: String(d.displayName || '').slice(0, 60), email: d.noEmail ? '' : String(d.email || '').trim(), code: String(d.code || ''), no_email: !!d.noEmail, birth: { month: +(d.birth && d.birth.month) || 0, year: +(d.birth && d.birth.year) || 0 } } });
    if (j && (j.code === 'region' || j.code === 'maint')) return { code: j.code };
    if (j && j.code === 'ip_blocked') return { error: 'Sign-ups are not available from this network.' };
    if (j && j.code === 'under13') return { code: 'under13' };
    if (status >= 400 || !j || j.error) return { error: (j && j.error) || 'Could not create the account. Try again.', field: j && j.field };
    if (j.needs_code) return { needs_code: true };
    const l = await api('/api/login', { method: 'POST', body: { username, password, device: '' } });
    if (l.j && l.j.token) return finishLogin(l.j.token, l.j.user);
    return { error: 'Your account was created. Sign in to continue.' };
  } catch { return { code: 'net' }; }
});
ipcMain.handle('auth:reset-request', async (_e, u) => {
  try { const { status, j } = await api('/api/auth/reset-request', { method: 'POST', body: { username: clean(u) } }); if (status >= 400 || !j || j.error) return { error: j && j.error === 'no_recovery' ? 'This account has no recovery email, so the password cannot be reset.' : (j && j.error) || 'Could not send the code.' }; return { contact: j.contact || '' }; } catch { return { code: 'net' }; }
});
ipcMain.handle('auth:reset-verify', async (_e, d) => {
  d = d || {};
  try {
    const path2 = d.backup ? '/api/auth/reset-backup' : '/api/auth/reset-verify';
    const { status, j } = await api(path2, { method: 'POST', body: { username: clean(d.username), code: String(d.code || '').trim(), newPassword: String(d.newPassword || '') } });
    if (status >= 400 || !j || j.error) return { error: (j && j.error) || 'That did not work.' };
    return { ok: true };
  } catch { return { code: 'net' }; }
});
const legalCache = {};
ipcMain.handle('legal:get', async (_e, name) => {
  if (!['terms', 'privacy'].includes(name)) return '';
  if (legalCache[name]) return legalCache[name];
  try {
    const r = await net.fetch(API + '/' + name + '.html'); if (!r.ok) return '';
    let h = await r.text();
    const m = h.match(/<main[\s\S]*?<\/main>/i) || h.match(/<body[\s\S]*<\/body>/i); h = m ? m[0] : h;
    h = h.replace(/<(script|style|nav|header|footer)[\s\S]*?<\/\1>/gi, '').replace(/<\/(p|h[1-6]|li|div|section|tr)>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
    h = h.replace(/&nbsp;/g, ' ').replace(/&rsquo;|&#8217;|&#39;/g, '’').replace(/&ldquo;|&rdquo;/g, '"').replace(/&mdash;/g, '—').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    return (legalCache[name] = h.slice(0, 60000));
  } catch { return ''; }
});
ipcMain.handle('account:summary', async () => {
  if (!sess) return null;
  try {
    const { status, j } = await api('/api/account/summary', { token: sess.token });
    if (status === 401) { endSession('Your session ended. Sign in again.'); return null; }
    return status === 200 ? j : null;
  } catch { return null; }
});
const pad = (n) => String(n).padStart(2, '0');
const isoDay = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
function occursOn(e, day) {
  if (e.date === day) return true;
  if (!e.rep || e.date > day || (e.rep_end && e.rep_end < day)) return false;
  const a = new Date(e.date + 'T12:00:00'), b = new Date(day + 'T12:00:00');
  const rep = String(e.rep).toLowerCase();
  if (rep.startsWith('d')) return true;
  if (rep.startsWith('w')) return a.getDay() === b.getDay();
  if (rep.startsWith('m')) return a.getDate() === b.getDate();
  if (rep.startsWith('y')) return a.getDate() === b.getDate() && a.getMonth() === b.getMonth();
  return false;
}
ipcMain.handle('home:data', async () => {
  if (!sess) return null;
  const out = { summary: null, events: [], tasks: [], overdue: 0, ok: true };
  try {
    const a = await api('/api/account/summary', { token: sess.token });
    if (a.status === 401) { endSession('Your session ended. Sign in again.'); return null; }
    if (a.status === 200) out.summary = a.j; else out.ok = false;
  } catch { out.ok = false; }
  try {
    const d = await api('/api/dusk/all', { token: sess.token });
    if (d.status === 200 && d.j) {
      const day = isoDay(new Date());
      out.events = (d.j.events || []).filter((e) => occursOn(e, day)).sort((x, y) => String(x.start || '').localeCompare(String(y.start || ''))).slice(0, 8)
        .map((e) => ({ id: e.id, title: e.title, start: e.start || '', end: e.end || '', color: e.color || 'violet' }));
      const open = (d.j.tasks || []).filter((t) => !t.done && (!t.due || t.due <= day));
      out.overdue = open.filter((t) => t.due && t.due < day).length;
      out.tasks = open.sort((x, y) => (y.pri - x.pri) || String(x.due || '9').localeCompare(String(y.due || '9'))).slice(0, 7)
        .map((t) => ({ id: t.id, title: t.title, due: t.due || '', pri: !!t.pri }));
    } else out.ok = false;
  } catch { out.ok = false; }
  return out;
});
async function postTask(title, day) { const r = await api('/api/dusk/tasks', { method: 'POST', token: sess.token, body: { title, due: day } }); return r.status === 200; }
async function flushQueue() {
  if (!sess || !settings.taskQueue || !settings.taskQueue.length) return;
  const rest = [];
  for (const q of settings.taskQueue) { try { if (!(await postTask(q.title, q.day))) { /* server said no: drop it */ } } catch { rest.push(q); } }
  settings.taskQueue = rest; writeSettings();
}
ipcMain.handle('home:add-task', async (_e, title) => {
  title = String(title || '').trim().slice(0, 200); if (!sess || !title) return false;
  const day = isoDay(new Date());
  try { return await postTask(title, day); }
  catch { settings.taskQueue = (settings.taskQueue || []).concat([{ title, day }]).slice(-50); writeSettings(); return 'queued'; }
});
ipcMain.handle('home:done-task', async (_e, id, done) => {
  if (!sess || !id) return false;
  try { const r = await api('/api/dusk/tasks/' + encodeURIComponent(String(id)) + '/done', { method: 'POST', token: sess.token, body: { done: !!done } }); return r.status === 200; } catch { return false; }
});
async function signOut() {
  const t = sess && sess.token;
  try { if (t) await api('/api/logout', { method: 'POST', token: t }); } catch {}
  sess = null; saveSess(); dropViews();
  try { await session.fromPartition('persist:lareon').clearStorageData(); } catch {}
  send('session', null);
  showHome();
}
ipcMain.on('open-external', (_e, u) => { if (typeof u === 'string' && (u === 'https://lareon.org' || u.startsWith('https://lareon.org/') || ALLOWED(hostOf(u)) || u === 'mailto:help@lareon.org')) shell.openExternal(u); });
ipcMain.on('auth:signout', () => signOut());
ipcMain.on('app:check-updates', () => checkUpdates(true));
ipcMain.handle('app:info', () => ({ version: app.getVersion(), platform: process.platform, lang: settings.lang || '', locale: app.getLocale() }));
ipcMain.on('app:lang', (_e, l) => { if (['en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'tr', 'sv', 'ja', 'ko', 'zh', 'hi', 'ar', 'fa', 'sw', 'ary'].includes(l)) { settings.lang = l; writeSettings(); } });
ipcMain.on('menu:account', (_e, pos) => {
  if (!win) return;
  const t = [];
  if (sess) t.push({ label: nameOf(sess.user) + '  (' + (sess.user.username || '') + '@lareon.org)', enabled: false }, { type: 'separator' });
  else t.push({ label: 'Sign in', click: () => showHome() }, { type: 'separator' });
  if (sess) t.push({ label: 'Account settings', click: () => show('account') });
  t.push({ label: 'What’s new', click: () => { if (!inSetup) { showHome(); whatsNew(true); } } },
      { label: 'Check for updates', click: () => checkUpdates(true) },
    { label: 'Run setup again', click: () => { settings.setupDone = false; writeSettings(); startSetup(); } },
    { label: 'Lareon help', click: () => show('help') },
    { label: 'Contact help@lareon.org', click: () => shell.openExternal('mailto:help@lareon.org') });
  if (sess) t.push({ type: 'separator' }, { label: 'Sign out', click: () => signOut() });
  Menu.buildFromTemplate(t).popup({ window: win, x: Math.round((pos && pos.x) || 0), y: Math.round((pos && pos.y) || BAR) });
});

// ---- first-run setup wizard ----
function startSetup() {
  inSetup = true; current = null;
  for (const v of Object.values(views)) v.setVisible(false);
  win.setTitle('Lareon');
  win.loadFile(path.join(__dirname, 'setup.html'));
}

// ---- tray, quick add and what's new ----
let tray = null, quick = null;
function makeTray() {
  try {
    const img = nativeImage.createFromPath(path.join(__dirname, '..', 'build', 'icon.png'));
    if (img.isEmpty()) return;
    tray = new Tray(img.resize({ width: isMac ? 18 : 16 }));
    tray.setToolTip('Lareon');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Open Lareon', click: showMain },
      { label: 'Quick add a task', click: openQuick },
      { type: 'separator' },
      { label: 'Quit Lareon', click: () => { quitting = true; app.quit(); } }
    ]));
    tray.on('click', showMain);
  } catch {}
}
function makeQuick() {
  quick = new BrowserWindow({
    width: 540, height: 110, show: false, frame: false, resizable: false, alwaysOnTop: true, skipTaskbar: true, fullscreenable: false,
    backgroundColor: BG(), webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  quick.loadFile(path.join(__dirname, 'quick.html'));
  quick.on('blur', () => { if (quick && quick.isVisible()) quick.hide(); });
  quick.on('closed', () => { quick = null; });
}
function openQuick() {
  if (!settings.setupDone) return;
  if (!quick) makeQuick();
  if (quick.isVisible()) { quick.hide(); return; }
  quick.center(); quick.show(); quick.focus(); quick.webContents.send('quick:show');
}
function applyQuick() {
  try { globalShortcut.unregister('CommandOrControl+Shift+Space'); } catch {}
  if (settings.quickAdd !== false) { try { globalShortcut.register('CommandOrControl+Shift+Space', openQuick); } catch {} }
}
ipcMain.on('quick:close', () => { if (quick) quick.hide(); });
function whatsNew(force) {
  const v = app.getVersion();
  if (force) return send('whatsnew', v);
  if (settings.lastSeen === v) return;
  if (!settings.lastSeen && !settings.setupDone) { settings.lastSeen = v; writeSettings(); return; }
  setTimeout(() => send('whatsnew', v), 1400);
}
ipcMain.on('wn:seen', () => { settings.lastSeen = app.getVersion(); writeSettings(); });
app.on('will-quit', () => { try { globalShortcut.unregisterAll(); } catch {} });
function startPage() {
  showHome();
  const want = settings.startApp === 'last' ? settings.lastApp : settings.startApp;
  if (sess && want && want !== 'home' && enabledKeys().includes(want)) show(want);
  whatsNew(false);
}
function startTabs() {
  inSetup = false;
  buildMenu();
  win.loadFile(path.join(__dirname, 'tabs.html'));
  win.webContents.once('did-finish-load', startPage);
}
ipcMain.handle('setup:state', () => ({ platform: process.platform, locale: app.getLocale(), settings: { ...settings, apps: { ...settings.apps }, sess: undefined, td: undefined }, user: sessInfo() }));
ipcMain.handle('setup:save', (_e, p) => {
  p = p || {};
  if (p.apps) { for (const k of Object.keys(apps)) if (typeof p.apps[k] === 'boolean') settings.apps[k] = p.apps[k]; }
  if (['system', 'light', 'dark'].includes(p.theme)) { settings.theme = p.theme; nativeTheme.themeSource = p.theme; }
  if (typeof p.notifications === 'boolean') settings.notifications = p.notifications;
  if (typeof p.launchAtLogin === 'boolean') settings.launchAtLogin = p.launchAtLogin;
  if (['en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'tr', 'sv', 'ja', 'ko', 'zh', 'hi', 'ar', 'fa', 'sw', 'ary'].includes(p.lang)) settings.lang = p.lang;
  writeSettings(); applyLogin();
  return true;
});
ipcMain.on('setup:test-notification', () => {
  try { if (Notification.isSupported()) new Notification({ title: 'Lareon', body: 'Notifications are on. Reminders and new mail will show up like this.' }).show(); } catch {}
});
ipcMain.on('setup:finish', () => { settings.setupDone = true; if (!settings.lastSeen) settings.lastSeen = app.getVersion(); writeSettings(); startTabs(); });

function createWindow() {
  const s = loadState();
  win = new BrowserWindow({
    width: s.width || 1200, height: s.height || 800, x: s.x, y: s.y, minWidth: 460, minHeight: 560,
    backgroundColor: BG(), title: 'Lareon', autoHideMenuBar: true,
    // no system title bar: the tabs bar is the title bar, and the window buttons sit inside it
    titleBarStyle: isMac ? 'hiddenInset' : 'hidden',
    ...(isMac ? { trafficLightPosition: { x: 16, y: 14 } } : { titleBarOverlay: { color: BG(), symbolColor: SYM(), height: BAR } }),
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  if (s.max) win.maximize();
  if (settings.setupDone) {
    win.loadFile(path.join(__dirname, 'tabs.html'));
    win.webContents.once('did-finish-load', startPage);
  } else {
    startSetup();
  }
  win.on('resize', layout);
  win.on('close', (e) => { saveState(); if (!quitting && !isMac && settings.background !== false && sess && settings.setupDone) { e.preventDefault(); win.hide(); } });
  win.on('closed', () => { win = null; for (const k of Object.keys(views)) delete views[k]; });
}

ipcMain.on('theme:get', (e) => { e.returnValue = ['light', 'dark'].includes(settings.theme) ? settings.theme : ''; });
const publicSettings = () => ({ theme: settings.theme, lang: settings.lang, notifications: settings.notifications !== false, remindEvents: settings.remindEvents !== false, remindLead: settings.remindLead, snoozeUntil: settings.snoozeUntil || 0, launchAtLogin: !!settings.launchAtLogin, startApp: settings.startApp, badge: settings.badge !== false, autoUpdate: settings.autoUpdate !== false, notifSound: settings.notifSound !== false, background: settings.background !== false, quickAdd: settings.quickAdd !== false, apps: { ...settings.apps }, version: app.getVersion(), platform: process.platform });
ipcMain.handle('settings:get', () => publicSettings());
ipcMain.handle('settings:set', (_e, p) => {
  p = p || {};
  const bool = (k) => { if (typeof p[k] === 'boolean') settings[k] = p[k]; };
  ['notifications', 'remindEvents', 'badge', 'autoUpdate', 'notifSound', 'background', 'quickAdd'].forEach(bool);
  if (typeof p.launchAtLogin === 'boolean') { settings.launchAtLogin = p.launchAtLogin; applyLogin(); }
  if (['system', 'light', 'dark'].includes(p.theme)) { settings.theme = p.theme; nativeTheme.themeSource = p.theme; paintChrome(); }
  if (['en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'tr', 'sv', 'ja', 'ko', 'zh', 'hi', 'ar', 'fa', 'sw', 'ary'].includes(p.lang)) settings.lang = p.lang;
  if ([0, 1, 5, 10, 15, 30].includes(p.remindLead)) settings.remindLead = p.remindLead;
  if (typeof p.snoozeUntil === 'number') settings.snoozeUntil = Math.max(0, p.snoozeUntil);
  if (typeof p.startApp === 'string' && (p.startApp === 'home' || p.startApp === 'last' || enabledKeys().includes(p.startApp))) settings.startApp = p.startApp;
  let appsChanged = false;
  if (p.apps) for (const k of Object.keys(apps)) if (typeof p.apps[k] === 'boolean' && settings.apps[k] !== p.apps[k]) {
    if (!p.apps[k] && enabledKeys().length <= 1) continue; // keep at least one app on
    settings.apps[k] = p.apps[k]; appsChanged = true;
    if (!p.apps[k] && views[k]) { try { win.contentView.removeChildView(views[k]); views[k].webContents.close(); } catch {} delete views[k]; if (current === k) showHome(); }
    else if (p.apps[k] && sess && !views[k]) views[k] = makeView(k);
  }
  writeSettings(); if (p.quickAdd !== undefined) applyQuick();
  if (appsChanged) { buildMenu(); send('apps-changed'); }
  if (p.badge !== undefined) setBadge(lastUnread);
  return publicSettings();
});
ipcMain.on('notify:show', (_e, t, b) => { if (t) notify(String(t).slice(0, 80), String(b || '').slice(0, 200), null); });
ipcMain.handle('net:online', () => net.isOnline());
let wasOnline = true;
setInterval(() => { try { const o = net.isOnline(); if (o !== wasOnline) { wasOnline = o; send('online', o); if (o) pollNotifications(); } } catch {} }, 4000);
ipcMain.handle('apps', () => { const o = {}; for (const k of enabledKeys()) o[k] = apps[k]; return o; });
ipcMain.on('show', (_e, k) => { if (!inSetup && (k === 'home' || k === 'account' || k === 'help' || enabledKeys().includes(k))) show(k); });
app.on('second-instance', () => showMain());
let quitting = false;
app.on('before-quit', () => { quitting = true; });
function showMain() { if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); } else if (app.isReady()) createWindow(); }

const openSettings = () => { if (inSetup || !win) return; showHome(); send('settings'); };
function setupAgain() { if (win) { settings.setupDone = false; writeSettings(); startSetup(); } }
ipcMain.on('setup:again', setupAgain);
function buildMenu() {
  const cur = () => (current && views[current] ? views[current].webContents : null);
  const go = (k) => () => { if (!inSetup) show(k); };
  const palette = () => { if (inSetup) return; showHome(); send('palette'); };
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac ? [{ label: 'Lareon', submenu: [{ role: 'about' }, { type: 'separator' }, { label: 'Settings…', accelerator: 'CmdOrCtrl+,', click: openSettings }, { type: 'separator' }, { role: 'services' }, { type: 'separator' }, { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }] }] : []),
    { role: 'editMenu' },
    { label: 'Apps', submenu: [...(isMac ? [] : [{ label: 'Settings…', accelerator: 'CmdOrCtrl+,', click: openSettings }, { type: 'separator' }]), { label: 'Jump to…', accelerator: 'CmdOrCtrl+K', click: palette }, { type: 'separator' }, { label: 'Home', accelerator: 'CmdOrCtrl+1', click: go('home') }, ...enabledKeys().map((k, i) => ({ label: apps[k].name, accelerator: 'CmdOrCtrl+' + (i + 2), click: go(k) }))] },
    { label: 'View', submenu: [{ label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => cur() && cur().reload() }, { role: 'togglefullscreen' }, { type: 'separator' },
      { label: 'Zoom in', accelerator: 'CmdOrCtrl+Plus', click: () => cur() && cur().setZoomLevel(cur().getZoomLevel() + 0.5) },
      { label: 'Zoom out', accelerator: 'CmdOrCtrl+-', click: () => cur() && cur().setZoomLevel(cur().getZoomLevel() - 0.5) },
      { label: 'Reset zoom', accelerator: 'CmdOrCtrl+0', click: () => cur() && cur().setZoomLevel(0) }] },
    { role: 'windowMenu' },
    { label: 'Help', submenu: [{ label: 'Lareon ' + app.getVersion(), enabled: false }, { type: 'separator' },
      { label: 'Check for updates', click: () => checkUpdates(true) },
      { label: 'Run setup again', click: setupAgain },
      { label: 'Lareon help', click: () => show('help') },
      { label: 'Contact help@lareon.org', click: () => shell.openExternal('mailto:help@lareon.org') }] }
  ]));
}

// ---- automatic updates (from GitHub Releases) ----

// ---- desktop notifications: new mail and event reminders, checked while Lareon is running ----
const seen = { mailTop: null, unread: null, events: new Set() };
function notify(title, body, key) {
  try {
    if (!Notification.isSupported() || Date.now() < (settings.snoozeUntil || 0)) return;
    const n = new Notification({ title, body, silent: settings.notifSound === false });
    n.on('click', () => { showMain(); if (key) show(key); });
    n.show();
  } catch {}
}
let lastUnread = 0;
function setBadge(n) {
  lastUnread = n;
  try { app.setBadgeCount(settings.badge === false ? 0 : n); } catch {}
}
const fromName = (a) => { a = String(a || ''); const m = a.match(/^\s*"?([^"<]+?)"?\s*<.*>\s*$/); return m ? m[1] : (a.split('@')[0] || a); };
async function pollNotifications() {
  if (!sess || !settings.setupDone) return;
  flushQueue();
  const t = sess.token;
  if (enabledKeys().includes('fledge')) {
    try {
      const a = await api('/api/account/summary', { token: t });
      if (a.status === 200 && a.j) {
        const rec = (a.j.recent || []).map((m) => ({ from: fromName(m.from_address), subject: m.subject || '', at: new Date(m.created_at).getTime() || 0 })).sort((x, y) => y.at - x.at);
        const top = rec.length ? rec[0].at : 0, unread = a.j.unread || 0;
        setBadge(unread);
        if (seen.mailTop === null) { seen.mailTop = top; seen.unread = unread; }
        else {
          const fresh = rec.filter((m) => m.at > seen.mailTop);
          const watching = win && win.isFocused() && current === 'fledge';
          if (settings.notifications !== false && fresh.length && unread >= (seen.unread || 0) && !watching) {
            if (fresh.length === 1) notify(fresh[0].from || 'Fledge', fresh[0].subject || 'New message', 'fledge');
            else notify('Fledge', fresh.length + ' new messages', 'fledge');
          }
          seen.mailTop = Math.max(seen.mailTop, top); seen.unread = unread;
        }
      }
    } catch {}
  }
  if (settings.remindEvents !== false && enabledKeys().includes('dusk')) {
    try {
      const d = await api('/api/dusk/all', { token: t });
      if (d.status === 200 && d.j) {
        const now = new Date(), day = isoDay(now), mins = now.getHours() * 60 + now.getMinutes();
        for (const e of (d.j.events || [])) {
          if (!e.start || !occursOn(e, day)) continue;
          const p = String(e.start).split(':'), at = (+p[0]) * 60 + (+p[1] || 0), left = at - mins, key = (e.id || e.title) + '|' + day;
          if (left >= 0 && left <= Math.max(0, Math.min(60, +settings.remindLead || 0)) && !seen.events.has(key)) { seen.events.add(key); notify(e.title || 'Dusk', left === 0 ? 'Starting now' : 'Starts in ' + left + ' min', 'dusk'); }
        }
        if (seen.events.size > 400) seen.events.clear();
      }
    } catch {}
  }
}

let updater = null;
try { updater = require('electron-updater').autoUpdater; } catch { updater = null; }
const REPO = 'lareon-admin-off/lareon-desktop';
const isNewer = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
// Mac: the app is not signed, so the normal updater cannot swap it. Lareon downloads the new copy itself and replaces the old one.
let macBusy = false, macZip = null;
async function macLatest() {
  const r = await net.fetch('https://api.github.com/repos/' + REPO + '/releases/latest', { headers: { Accept: 'application/vnd.github+json' } });
  if (!r.ok) return null;
  const j = await r.json(); const v = String(j.tag_name || '').replace(/^v\.?/, '');
  const zips = (j.assets || []).filter((a) => /\.zip$/i.test(a.name) && !/blockmap/i.test(a.name));
  const z = zips.find((a) => /^lareon\.zip$/i.test(a.name)) || zips.find((a) => /mac|darwin|arm64/i.test(a.name)) || zips[0];
  macZip = z ? z.browser_download_url : null;
  return /^\d+\.\d+\.\d+$/.test(v) ? v : null;
}
async function macInstall(version) {
  if (macBusy) return; macBusy = true;
  try {
    const os = require('os'), cp = require('child_process');
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'lareon-up-'));
    const zip = path.join(work, 'Lareon.zip');
    const r = await net.fetch(macZip || ('https://github.com/' + REPO + '/releases/download/v' + version + '/Lareon.zip'), { redirect: 'follow' });
    if (!r.ok) throw new Error('download failed (' + r.status + ')');
    fs.writeFileSync(zip, Buffer.from(await r.arrayBuffer()));
    const out = path.join(work, 'new'); fs.mkdirSync(out);
    cp.execFileSync('/usr/bin/ditto', ['-x', '-k', zip, out]);
    const fresh = path.join(out, 'Lareon.app'); if (!fs.existsSync(fresh)) throw new Error('the zip did not contain Lareon.app');
    const cur = path.resolve(process.execPath, '../../..');
    const sh = path.join(work, 'swap.sh');
    fs.writeFileSync(sh, '#!/bin/bash\nwhile kill -0 ' + process.pid + ' 2>/dev/null; do sleep 0.4; done\nAPP="$1"; NEW="$2"\nrm -rf "$APP.old"\nif mv "$APP" "$APP.old" && /usr/bin/ditto "$NEW" "$APP"; then /usr/bin/xattr -cr "$APP"; rm -rf "$APP.old"; else rm -rf "$APP"; mv "$APP.old" "$APP"; fi\nopen "$APP"\n', { mode: 0o755 });
    cp.spawn('/bin/bash', [sh, cur, fresh], { detached: true, stdio: 'ignore' }).unref();
    app.quit();
  } catch (err) {
    macBusy = false;
    const why = String((err && err.message) || err || '').slice(0, 160);
    try { fs.appendFileSync(path.join(app.getPath('userData'), 'update.log'), new Date().toISOString() + ' ' + why + '\n'); } catch {}
    dialog.showMessageBox(win || undefined, { type: 'warning', message: 'Lareon could not install the update', detail: 'Reason: ' + why + '\n\nDownload the newest version from lareon.org/download and drag it into Applications.', buttons: ['Open download page', 'Close'], defaultId: 0, cancelId: 1 }).then((r) => { if (r.response === 0) shell.openExternal('https://lareon.org/download'); });
  }
}
async function macCheck(manual) {
  try {
    const v = await macLatest();
    if (v && isNewer(v, app.getVersion())) {
      const r = await dialog.showMessageBox(win || undefined, { type: 'info', message: 'Lareon ' + v + ' is available', detail: 'Lareon will download it, replace the old version and open again. This takes a moment.', buttons: ['Update now', 'Later'], defaultId: 0, cancelId: 1 });
      if (r.response === 0) macInstall(v);
    } else if (manual) dialog.showMessageBox({ message: 'Lareon is up to date.', detail: 'Version ' + app.getVersion() });
  } catch { if (manual) dialog.showMessageBox({ message: 'Could not check for updates.', detail: 'Check your connection and try again.' }); }
}
function checkUpdates(manual) {
  if (!app.isPackaged) { if (manual) dialog.showMessageBox({ message: 'Updates are checked in the installed app.' }); return; }
  if (isMac) return macCheck(manual);
  if (!updater) return;
  updater.checkForUpdates().then((r) => {
    if (manual && r && r.updateInfo && r.updateInfo.version === app.getVersion()) dialog.showMessageBox({ message: 'Lareon is up to date.', detail: 'Version ' + app.getVersion() });
  }).catch(() => { if (manual) dialog.showMessageBox({ message: 'Could not check for updates.', detail: 'Check your connection and try again.' }); });
}
function startUpdater() {
  if (!app.isPackaged) return;
  if (isMac) { setTimeout(() => { if (settings.autoUpdate !== false) macCheck(false); }, 8000); setInterval(() => { if (settings.autoUpdate !== false) macCheck(false); }, 6 * 60 * 60 * 1000); return; }
  if (!updater) return;
  updater.autoDownload = settings.autoUpdate !== false;
  updater.autoInstallOnAppQuit = true;
  updater.on('update-downloaded', (info) => {
    dialog.showMessageBox(win || undefined, { type: 'info', message: 'Lareon ' + info.version + ' is ready', detail: 'Restart to finish updating. If you wait, it installs next time you quit.', buttons: ['Restart now', 'Later'], defaultId: 0, cancelId: 1 })
      .then((r) => { if (r.response === 0) updater.quitAndInstall(); });
  });
  updater.on('error', () => {});
  const auto = () => { if (settings.autoUpdate !== false) updater.checkForUpdates().catch(() => {}); };
  setTimeout(auto, 8000); setInterval(auto, 6 * 60 * 60 * 1000);
}

app.whenReady().then(() => {
  loadSettings(); loadSess(); nativeTheme.themeSource = settings.theme || 'system'; applyLogin();
  // Notifications and clipboard are fine for Lareon pages (notifications only if you left them on); camera, mic, location and the rest are refused.
  session.fromPartition('persist:lareon').setPermissionRequestHandler((wc, perm, cb) => {
    const ok = ALLOWED(hostOf(wc.getURL())) && ['notifications', 'clipboard-sanitized-write', 'clipboard-read', 'fullscreen'].includes(perm);
    cb(ok && perm !== 'notifications');
  });
  buildMenu();
  createWindow();
  makeTray(); applyQuick();
  if (sess && settings.setupDone) for (const k of enabledKeys()) views[k] = makeView(k); // ready in the background
  startUpdater();
  setTimeout(pollNotifications, 12000); setInterval(pollNotifications, 60000);
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => { if (!isMac) app.quit(); });
