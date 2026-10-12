const { app, BrowserWindow, WebContentsView, shell, Menu, session, ipcMain, Notification, nativeTheme, safeStorage, net, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const apps = require('./apps.json');
const EXTRA = { account: { name: 'Account', url: 'https://lareon.org/account', ua: 'LareonApp' } };
const appOf = (k) => apps[k] || EXTRA[k];

app.setName('Lareon');
const BAR = 44;
const API = 'https://lareon.org';
const ALLOWED = (h) => h === 'lareon.org' || h.endsWith('.lareon.org');
const hostOf = (u) => { try { return new URL(u).hostname; } catch { return ''; } };
const isMac = process.platform === 'darwin';
const external = (u) => { if (/^https?:\/\//.test(u) || u === 'mailto:help@lareon.org') shell.openExternal(u); };

if (!app.requestSingleInstanceLock()) app.quit();

// ---- settings (chosen in the setup wizard) ----
const DEFAULTS = { setupDone: false, apps: { dusk: true, fledge: true, aster: true }, notifications: true, launchAtLogin: false, theme: 'system', sess: null };
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
  return { status: r.status, j };
}

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
function endSession(note) {
  sess = null; saveSess(); dropViews();
  send('session', null);
  showHome(note);
}
function makeView(key) {
  const A = appOf(key);
  const v = new WebContentsView({ webPreferences: { partition: 'persist:lareon', contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: true } });
  const wc = v.webContents;
  wc.setUserAgent(wc.getUserAgent().replace(/ Electron\/\S+/, '').replace(/ lareon-desktop\/\S+/, '') + ' ' + A.ua);
  wc.setWindowOpenHandler(({ url: u }) => {
    if (isBounce(u)) { endSession('Your session ended. Sign in again.'); return { action: 'deny' }; }
    if (key !== 'account' && ALLOWED(hostOf(u)) && hostOf(u) !== 'lareon.org') return { action: 'allow' };
    external(u); return { action: 'deny' };
  });
  wc.on('will-navigate', (e, u) => {
    if (isBounce(u)) { e.preventDefault(); endSession('Your session ended. Sign in again.'); return; }
    if (key === 'account' ? hostOf(u) !== 'lareon.org' : (!ALLOWED(hostOf(u)) || hostOf(u) === 'lareon.org')) { e.preventDefault(); external(u); }
  });
  v._ready = false;
  const ready = () => { if (v._ready) return; v._ready = true; send('loading', { key, on: false }); if (current === key) reveal(key); };
  wc.on('did-start-loading', () => { if (!v._ready) send('loading', { key, on: true }); });
  wc.on('did-fail-load', ready);
  setTimeout(ready, 9000);
  wc.on('did-fail-load', (_e, code, _d, u, isMain) => {
    if (isMain && code !== -3) wc.loadFile(path.join(__dirname, 'offline.html'), { query: { app: A.name, url: A.url } });
  });
  // make sure the site knows who is signed in (once, right after it first loads)
  let synced = false;
  wc.on('did-finish-load', () => {
    if (synced || !sess || !ALLOWED(hostOf(wc.getURL()))) return;
    synced = true;
    const T = JSON.stringify(sess.token), U = JSON.stringify(JSON.stringify(sess.user));
    wc.executeJavaScript('(function(){try{if(localStorage.getItem("lt")===' + T + ')return false;localStorage.setItem("lt",' + T + ');localStorage.setItem("lu",' + U + ');return true}catch(e){return false}})()')
      .then((changed) => { if (changed) { v._changed = true; wc.reload(); wc.once('did-stop-loading', () => { v._changed = false; ready(); }); } else ready(); }).catch(ready);
  });
  if (key === 'account') { const t = setInterval(() => { if (wc.isDestroyed()) return clearInterval(t); if (!sess || !synced) return; wc.executeJavaScript('localStorage.getItem("lt")').then((x) => { if (!x && sess) endSession(); }).catch(() => {}); }, 4000); }
  wc.loadURL(A.url);
  v.setBackgroundColor('#13111b');
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
  if (!sess) return showHome('Sign in to open ' + appOf(key).name + '.');
  if (!views[key]) views[key] = makeView(key);
  current = key;
  win.setTitle('Lareon');
  for (const v of Object.values(views)) v.setVisible(false);
  send('shown', key);
  if (views[key]._ready) reveal(key); else send('loading', { key, on: true });
}

// ---- sign in (Lareon's own screen; talks to Lareon directly) ----
async function finishLogin(token, user) {
  sess = { token, user };
  saveSess();
  dropViews();
  for (const k of enabledKeys()) views[k] = makeView(k); // load quietly so every app is ready and signed in
  send('session', sessInfo());
  return { ok: true, user: sessInfo() };
}
ipcMain.handle('auth:session', () => sessInfo());
ipcMain.handle('auth:login', async (_e, c) => {
  const username = String((c && c.username) || '').trim().toLowerCase().replace(/@lareon\.org$/, '');
  const password = String((c && c.password) || '');
  if (!username || !password) return { error: 'Enter your username and password.' };
  try {
    const { status, j } = await api('/api/login', { method: 'POST', body: { username, password } });
    if (j && j.token) return finishLogin(j.token, j.user);
    if (j && j.requires2FA) { pending2fa = username; return { need2fa: true, contact: j.contact || '', app: !!j.app }; }
    if (status === 403 && j && j.error === 'banned') return { error: 'This account is not available. Write to help@lareon.org.' };
    if (status === 429) return { error: 'Too many attempts. Wait a few minutes and try again.' };
    return { error: (j && j.error) || 'Could not sign in. Try again.' };
  } catch { return { error: 'Can’t reach Lareon. Check your connection.' }; }
});
ipcMain.handle('auth:verify', async (_e, code) => {
  if (!pending2fa) return { error: 'Start again from the sign-in screen.' };
  try {
    const { j } = await api('/api/auth/2fa/verify', { method: 'POST', body: { username: pending2fa, code: String(code || '').trim() } });
    if (j && j.token) { pending2fa = null; return finishLogin(j.token, j.user); }
    return { error: (j && j.error) || 'That code did not work. Try again.' };
  } catch { return { error: 'Can’t reach Lareon. Check your connection.' }; }
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
  const out = { summary: null, events: [], tasks: [], overdue: 0 };
  try {
    const a = await api('/api/account/summary', { token: sess.token });
    if (a.status === 401) { endSession('Your session ended. Sign in again.'); return null; }
    if (a.status === 200) out.summary = a.j;
  } catch {}
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
    }
  } catch {}
  return out;
});
ipcMain.handle('home:add-task', async (_e, title) => {
  title = String(title || '').trim().slice(0, 200); if (!sess || !title) return false;
  try { const r = await api('/api/dusk/tasks', { method: 'POST', token: sess.token, body: { title, due: isoDay(new Date()) } }); return r.status === 200; } catch { return false; }
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
ipcMain.handle('app:info', () => ({ version: app.getVersion(), platform: process.platform }));
ipcMain.on('menu:account', (_e, pos) => {
  if (!win) return;
  const t = [];
  if (sess) t.push({ label: nameOf(sess.user) + '  (' + (sess.user.username || '') + '@lareon.org)', enabled: false }, { type: 'separator' });
  else t.push({ label: 'Sign in', click: () => showHome() }, { type: 'separator' });
  if (sess) t.push({ label: 'Account settings', click: () => show('account') });
  t.push({ label: 'Check for updates', click: () => checkUpdates(true) },
    { label: 'Run setup again', click: () => { settings.setupDone = false; writeSettings(); startSetup(); } },
    { label: 'Lareon help', click: () => shell.openExternal('https://lareon.org/help.html') },
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
function startTabs() {
  inSetup = false;
  buildMenu();
  win.loadFile(path.join(__dirname, 'tabs.html'));
  win.webContents.once('did-finish-load', () => showHome());
}
ipcMain.handle('setup:state', () => ({ platform: process.platform, settings: { ...settings, apps: { ...settings.apps }, sess: undefined }, user: sessInfo() }));
ipcMain.handle('setup:save', (_e, p) => {
  p = p || {};
  if (p.apps) { for (const k of Object.keys(apps)) if (typeof p.apps[k] === 'boolean') settings.apps[k] = p.apps[k]; }
  if (['system', 'light', 'dark'].includes(p.theme)) { settings.theme = p.theme; nativeTheme.themeSource = p.theme; }
  if (typeof p.notifications === 'boolean') settings.notifications = p.notifications;
  if (typeof p.launchAtLogin === 'boolean') settings.launchAtLogin = p.launchAtLogin;
  writeSettings(); applyLogin();
  return true;
});
ipcMain.on('setup:test-notification', () => {
  try { if (Notification.isSupported()) new Notification({ title: 'Lareon', body: 'Notifications are on. Reminders and new mail will show up like this.' }).show(); } catch {}
});
ipcMain.on('setup:finish', () => { settings.setupDone = true; writeSettings(); startTabs(); });

function createWindow() {
  const s = loadState();
  win = new BrowserWindow({
    width: s.width || 1200, height: s.height || 800, x: s.x, y: s.y, minWidth: 460, minHeight: 560,
    backgroundColor: '#13111b', title: 'Lareon', autoHideMenuBar: true,
    // no system title bar: the tabs bar is the title bar, and the window buttons sit inside it
    titleBarStyle: isMac ? 'hiddenInset' : 'hidden',
    ...(isMac ? { trafficLightPosition: { x: 16, y: 14 } } : { titleBarOverlay: { color: '#13111b', symbolColor: '#f3eee8', height: BAR } }),
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  if (s.max) win.maximize();
  if (settings.setupDone) {
    win.loadFile(path.join(__dirname, 'tabs.html'));
    win.webContents.once('did-finish-load', () => showHome());
  } else {
    startSetup();
  }
  win.on('resize', layout);
  win.on('close', saveState);
  win.on('closed', () => { win = null; for (const k of Object.keys(views)) delete views[k]; });
}

ipcMain.handle('apps', () => { const o = {}; for (const k of enabledKeys()) o[k] = apps[k]; return o; });
ipcMain.on('show', (_e, k) => { if (!inSetup && (k === 'home' || k === 'account' || enabledKeys().includes(k))) show(k); });
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

function buildMenu() {
  const cur = () => (current && views[current] ? views[current].webContents : null);
  const go = (k) => () => { if (!inSetup) show(k); };
  const palette = () => { if (inSetup) return; showHome(); send('palette'); };
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'editMenu' },
    { label: 'Apps', submenu: [{ label: 'Jump to…', accelerator: 'CmdOrCtrl+K', click: palette }, { type: 'separator' }, { label: 'Home', accelerator: 'CmdOrCtrl+1', click: go('home') }, ...enabledKeys().map((k, i) => ({ label: apps[k].name, accelerator: 'CmdOrCtrl+' + (i + 2), click: go(k) }))] },
    { label: 'View', submenu: [{ label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => cur() && cur().reload() }, { role: 'togglefullscreen' }, { type: 'separator' },
      { label: 'Zoom in', accelerator: 'CmdOrCtrl+Plus', click: () => cur() && cur().setZoomLevel(cur().getZoomLevel() + 0.5) },
      { label: 'Zoom out', accelerator: 'CmdOrCtrl+-', click: () => cur() && cur().setZoomLevel(cur().getZoomLevel() - 0.5) },
      { label: 'Reset zoom', accelerator: 'CmdOrCtrl+0', click: () => cur() && cur().setZoomLevel(0) }] },
    { role: 'windowMenu' },
    { label: 'Help', submenu: [{ label: 'Lareon ' + app.getVersion(), enabled: false }, { type: 'separator' },
      { label: 'Check for updates', click: () => checkUpdates(true) },
      { label: 'Run setup again', click: () => { if (win) { settings.setupDone = false; writeSettings(); startSetup(); } } },
      { label: 'Lareon help', click: () => shell.openExternal('https://lareon.org/help.html') },
      { label: 'Contact help@lareon.org', click: () => shell.openExternal('mailto:help@lareon.org') }] }
  ]));
}

// ---- automatic updates (from GitHub Releases) ----
let updater = null;
try { updater = require('electron-updater').autoUpdater; } catch { updater = null; }
function checkUpdates(manual) {
  if (!updater || !app.isPackaged) { if (manual) dialog.showMessageBox({ message: 'Updates are checked in the installed app.' }); return; }
  updater.checkForUpdates().then((r) => {
    if (manual && r && r.updateInfo && r.updateInfo.version === app.getVersion()) dialog.showMessageBox({ message: 'Lareon is up to date.', detail: 'Version ' + app.getVersion() });
  }).catch(() => { if (manual) dialog.showMessageBox({ message: 'Could not check for updates.', detail: 'Check your connection and try again.' }); });
}
function startUpdater() {
  if (!updater || !app.isPackaged) return;
  updater.autoDownload = true;
  updater.autoInstallOnAppQuit = true;
  updater.on('update-downloaded', (info) => {
    dialog.showMessageBox(win || undefined, { type: 'info', message: 'Lareon ' + info.version + ' is ready', detail: 'Restart to finish updating. If you wait, it installs next time you quit.', buttons: ['Restart now', 'Later'], defaultId: 0, cancelId: 1 })
      .then((r) => { if (r.response === 0) updater.quitAndInstall(); });
  });
  updater.on('error', () => {});
  setTimeout(() => updater.checkForUpdates().catch(() => {}), 8000);
  setInterval(() => updater.checkForUpdates().catch(() => {}), 6 * 60 * 60 * 1000);
}

app.whenReady().then(() => {
  loadSettings(); loadSess(); nativeTheme.themeSource = settings.theme || 'system'; applyLogin();
  // Notifications and clipboard are fine for Lareon pages (notifications only if you left them on); camera, mic, location and the rest are refused.
  session.fromPartition('persist:lareon').setPermissionRequestHandler((wc, perm, cb) => {
    const ok = ALLOWED(hostOf(wc.getURL())) && ['notifications', 'clipboard-sanitized-write', 'clipboard-read', 'fullscreen'].includes(perm);
    cb(ok && (perm !== 'notifications' || settings.notifications !== false));
  });
  buildMenu();
  createWindow();
  if (sess && settings.setupDone) for (const k of enabledKeys()) views[k] = makeView(k); // ready in the background
  startUpdater();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => { if (!isMac) app.quit(); });
