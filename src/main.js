const { app, BrowserWindow, WebContentsView, shell, Menu, session, ipcMain, Notification, nativeTheme } = require('electron');
const fs = require('fs');
const path = require('path');
const apps = require('./apps.json');

app.setName('Lareon');
const BAR = 44;
const ALLOWED = (h) => h === 'lareon.org' || h.endsWith('.lareon.org');
const hostOf = (u) => { try { return new URL(u).hostname; } catch { return ''; } };
const external = (u) => { if (/^(https?|mailto):/.test(u)) shell.openExternal(u); };
const accountUrl = (key) => 'https://lareon.org/account?continue=' + key;

if (!app.requestSingleInstanceLock()) app.quit();

// ---- settings (chosen in the setup wizard) ----
const DEFAULTS = { setupDone: false, apps: { dusk: true, fledge: true, aster: true }, first: 'dusk', notifications: true, launchAtLogin: false, theme: 'system' };
const settingsFile = () => path.join(app.getPath('userData'), 'settings.json');
let settings = { ...DEFAULTS };
function loadSettings() {
  try { settings = { ...DEFAULTS, ...JSON.parse(fs.readFileSync(settingsFile(), 'utf8')) }; } catch { settings = { ...DEFAULTS }; }
  settings.apps = { ...DEFAULTS.apps, ...(settings.apps || {}) };
}
const writeSettings = () => { try { fs.writeFileSync(settingsFile(), JSON.stringify(settings)); } catch {} };
const enabledKeys = () => Object.keys(apps).filter((k) => settings.apps[k] !== false);
const firstKey = () => (enabledKeys().includes(settings.first) ? settings.first : enabledKeys()[0] || 'dusk');
function applyLogin() { try { app.setLoginItemSettings({ openAtLogin: !!settings.launchAtLogin }); } catch {} }

let win, current = null, inSetup = false, signKey = null, watch = null;
const views = {};
const stateFile = () => path.join(app.getPath('userData'), 'window.json');
const loadState = () => { try { return JSON.parse(fs.readFileSync(stateFile(), 'utf8')); } catch { return {}; } };
function saveState() {
  if (!win || win.isDestroyed()) return;
  try { fs.writeFileSync(stateFile(), JSON.stringify({ ...win.getNormalBounds(), max: win.isMaximized(), last: current })); } catch {}
}

function layout() {
  if (!win || win.isDestroyed() || inSetup) return;
  const [w, h] = win.getContentSize();
  for (const v of Object.values(views)) v.setBounds({ x: 0, y: BAR, width: w, height: Math.max(0, h - BAR) });
}

function makeView(key, url) {
  const A = apps[key];
  const v = new WebContentsView({ webPreferences: { partition: 'persist:lareon', contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: true } });
  const wc = v.webContents;
  wc.setUserAgent(wc.getUserAgent().replace(/ Electron\/\S+/, '').replace(/ lareon-desktop\/\S+/, '') + ' ' + A.ua);
  wc.setWindowOpenHandler(({ url: u }) => { if (ALLOWED(hostOf(u))) return { action: 'allow' }; external(u); return { action: 'deny' }; });
  wc.on('will-navigate', (e, u) => { if (!ALLOWED(hostOf(u))) { e.preventDefault(); external(u); } });
  wc.on('did-fail-load', (_e, code, _d, u, isMain) => {
    if (isMain && code !== -3) wc.loadFile(path.join(__dirname, 'offline.html'), { query: { app: A.name, url: A.url } });
  });
  wc.loadURL(url || A.url);
  v.setBackgroundColor('#141119');
  v.setVisible(false);
  win.contentView.addChildView(v);
  return v;
}

function show(key) {
  if (!apps[key] || !win) return;
  if (!views[key]) views[key] = makeView(key);
  layout();
  for (const [k, v] of Object.entries(views)) v.setVisible(k === key);
  current = key;
  win.setTitle('Lareon');
  win.webContents.send('shown', key);
  views[key].webContents.focus();
}

// ---- first-run setup wizard ----
function stopWatch() { if (watch) { clearInterval(watch); watch = null; } }
function startSetup() {
  inSetup = true; current = null; stopWatch();
  for (const v of Object.values(views)) v.setVisible(false);
  win.setTitle('Lareon');
  win.loadFile(path.join(__dirname, 'setup.html'));
}
function startTabs() {
  inSetup = false; stopWatch();
  buildMenu();
  win.loadFile(path.join(__dirname, 'tabs.html'));
  win.webContents.once('did-finish-load', () => show(firstKey()));
}
function nameFrom(u) {
  try { const o = JSON.parse(u); return o.display_name || o.username || String(o.email || '').split('@')[0] || ''; } catch { return ''; }
}
ipcMain.handle('setup:state', () => ({ platform: process.platform, settings: { ...settings, apps: { ...settings.apps } } }));
ipcMain.handle('setup:save', (_e, p) => {
  p = p || {};
  if (p.apps) { for (const k of Object.keys(apps)) if (typeof p.apps[k] === 'boolean') settings.apps[k] = p.apps[k]; }
  if (typeof p.first === 'string' && apps[p.first]) settings.first = p.first;
  if (['system', 'light', 'dark'].includes(p.theme)) { settings.theme = p.theme; nativeTheme.themeSource = p.theme; }
  if (typeof p.notifications === 'boolean') settings.notifications = p.notifications;
  if (typeof p.launchAtLogin === 'boolean') settings.launchAtLogin = p.launchAtLogin;
  writeSettings(); applyLogin();
  return true;
});
ipcMain.on('setup:test-notification', () => {
  try { if (Notification.isSupported()) new Notification({ title: 'Lareon', body: 'Notifications are on. Reminders and new mail will show up like this.' }).show(); } catch {}
});
ipcMain.on('setup:signin-start', () => {
  if (!win || !inSetup) return;
  signKey = firstKey();
  if (!views[signKey]) views[signKey] = makeView(signKey, accountUrl(signKey));
  stopWatch();
  watch = setInterval(() => {
    const v = views[signKey];
    if (!v || v.webContents.isDestroyed()) return;
    if (hostOf(v.webContents.getURL()) === 'lareon.org') return; // wait until sign-in has returned to the app
    v.webContents.executeJavaScript("(function(){try{var t=localStorage.getItem('lt'),u=localStorage.getItem('lu');return t&&u?u:null}catch(e){return null}})()").then((u) => {
      if (!u || !watch) return;
      stopWatch();
      // open the other chosen apps quietly so the one sign-in carries over to them
      for (const k of enabledKeys()) if (!views[k]) views[k] = makeView(k, accountUrl(k));
      if (win && !win.isDestroyed()) win.webContents.send('setup:signed-in', nameFrom(u));
    }).catch(() => {});
  }, 1500);
});
ipcMain.on('setup:signin-bounds', (_e, b) => {
  const v = views[signKey];
  if (!v || !inSetup || !b) return;
  v.setBounds({ x: Math.max(0, b.x | 0), y: Math.max(0, b.y | 0), width: Math.max(0, b.width | 0), height: Math.max(0, b.height | 0) });
  v.setVisible(true);
});
ipcMain.on('setup:signin-hide', () => { const v = views[signKey]; if (v) v.setVisible(false); });
ipcMain.on('setup:finish', () => { settings.setupDone = true; writeSettings(); startTabs(); });

function createWindow() {
  const s = loadState();
  win = new BrowserWindow({
    width: s.width || 1200, height: s.height || 800, x: s.x, y: s.y, minWidth: 420, minHeight: 560,
    backgroundColor: '#141119', title: 'Lareon', autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  if (s.max) win.maximize();
  if (settings.setupDone) {
    win.loadFile(path.join(__dirname, 'tabs.html'));
    win.webContents.once('did-finish-load', () => show(enabledKeys().includes(s.last) ? s.last : firstKey()));
  } else {
    startSetup();
  }
  win.on('resize', layout);
  win.on('close', saveState);
  win.on('closed', () => { stopWatch(); win = null; for (const k of Object.keys(views)) delete views[k]; });
}

ipcMain.handle('apps', () => { const o = {}; for (const k of enabledKeys()) o[k] = apps[k]; return o; });
ipcMain.on('show', (_e, k) => { if (!inSetup && enabledKeys().includes(k)) show(k); });
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

function buildMenu() {
  const cur = () => (current && views[current] ? views[current].webContents : null);
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    { role: 'editMenu' },
    { label: 'Apps', submenu: enabledKeys().map((k, i) => ({ label: apps[k].name, accelerator: 'CmdOrCtrl+' + (i + 1), click: () => { if (!inSetup) show(k); } })) },
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
  const { dialog } = require('electron');
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
    const { dialog } = require('electron');
    dialog.showMessageBox(win || undefined, { type: 'info', message: 'Lareon ' + info.version + ' is ready', detail: 'Restart to finish updating. If you wait, it installs next time you quit.', buttons: ['Restart now', 'Later'], defaultId: 0, cancelId: 1 })
      .then((r) => { if (r.response === 0) updater.quitAndInstall(); });
  });
  updater.on('error', () => {});
  setTimeout(() => updater.checkForUpdates().catch(() => {}), 8000);
  setInterval(() => updater.checkForUpdates().catch(() => {}), 6 * 60 * 60 * 1000);
}

app.whenReady().then(() => {
  loadSettings(); nativeTheme.themeSource = settings.theme || "system"; applyLogin();
  // Notifications and clipboard are fine for Lareon pages (notifications only if you left them on); camera, mic, location and the rest are refused.
  session.fromPartition('persist:lareon').setPermissionRequestHandler((wc, perm, cb) => {
    const ok = ALLOWED(hostOf(wc.getURL())) && ['notifications', 'clipboard-sanitized-write', 'clipboard-read', 'fullscreen'].includes(perm);
    cb(ok && (perm !== 'notifications' || settings.notifications !== false));
  });
  buildMenu();
  createWindow();
  startUpdater();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
