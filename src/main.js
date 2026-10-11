const { app, BrowserWindow, WebContentsView, shell, Menu, session, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const apps = require('./apps.json');

app.setName('Lareon');
const BAR = 44;
const ALLOWED = (h) => h === 'lareon.org' || h.endsWith('.lareon.org');
const hostOf = (u) => { try { return new URL(u).hostname; } catch { return ''; } };
const external = (u) => { if (/^(https?|mailto):/.test(u)) shell.openExternal(u); };

if (!app.requestSingleInstanceLock()) app.quit();

let win, current = null;
const views = {};
const stateFile = () => path.join(app.getPath('userData'), 'window.json');
const loadState = () => { try { return JSON.parse(fs.readFileSync(stateFile(), 'utf8')); } catch { return {}; } };
function saveState() {
  if (!win || win.isDestroyed()) return;
  try { fs.writeFileSync(stateFile(), JSON.stringify({ ...win.getNormalBounds(), max: win.isMaximized(), last: current })); } catch {}
}

function layout() {
  if (!win || win.isDestroyed()) return;
  const [w, h] = win.getContentSize();
  for (const v of Object.values(views)) v.setBounds({ x: 0, y: BAR, width: w, height: Math.max(0, h - BAR) });
}

function makeView(key) {
  const A = apps[key];
  const v = new WebContentsView({ webPreferences: { partition: 'persist:lareon', contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: true } });
  const wc = v.webContents;
  wc.setUserAgent(wc.getUserAgent().replace(/ Electron\/\S+/, '').replace(/ lareon-desktop\/\S+/, '') + ' ' + A.ua);
  wc.setWindowOpenHandler(({ url }) => { if (ALLOWED(hostOf(url))) return { action: 'allow' }; external(url); return { action: 'deny' }; });
  wc.on('will-navigate', (e, url) => { if (!ALLOWED(hostOf(url))) { e.preventDefault(); external(url); } });
  wc.on('did-fail-load', (_e, code, _d, url, isMain) => {
    if (isMain && code !== -3) wc.loadFile(path.join(__dirname, 'offline.html'), { query: { app: A.name, url: A.url } });
  });
  wc.loadURL(A.url);
  v.setBackgroundColor('#141119');
  return v;
}

function show(key) {
  if (!apps[key] || !win) return;
  if (!views[key]) { views[key] = makeView(key); win.contentView.addChildView(views[key]); layout(); }
  for (const [k, v] of Object.entries(views)) v.setVisible(k === key);
  current = key;
  win.setTitle('Lareon · ' + apps[key].name);
  win.webContents.send('shown', key);
  views[key].webContents.focus();
}

function createWindow() {
  const s = loadState();
  win = new BrowserWindow({
    width: s.width || 1200, height: s.height || 800, x: s.x, y: s.y, minWidth: 420, minHeight: 560,
    backgroundColor: '#141119', title: 'Lareon', autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  if (s.max) win.maximize();
  win.loadFile(path.join(__dirname, 'tabs.html'));
  win.webContents.once('did-finish-load', () => show(apps[s.last] ? s.last : 'dusk'));
  win.on('resize', layout);
  win.on('close', saveState);
  win.on('closed', () => { win = null; for (const k of Object.keys(views)) delete views[k]; });
}

ipcMain.handle('apps', () => apps);
ipcMain.on('show', (_e, k) => show(k));
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

app.whenReady().then(() => {
  session.fromPartition('persist:lareon').setPermissionRequestHandler((wc, perm, cb) => {
    cb(ALLOWED(hostOf(wc.getURL())) && ['notifications', 'clipboard-sanitized-write', 'clipboard-read', 'fullscreen'].includes(perm));
  });
  const cur = () => (current && views[current] ? views[current].webContents : null);
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    { role: 'editMenu' },
    { label: 'Apps', submenu: Object.keys(apps).map((k, i) => ({ label: apps[k].name, accelerator: 'CmdOrCtrl+' + (i + 1), click: () => show(k) })) },
    { label: 'View', submenu: [{ label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => cur() && cur().reload() }, { role: 'togglefullscreen' }, { type: 'separator' },
      { label: 'Zoom in', accelerator: 'CmdOrCtrl+Plus', click: () => cur() && cur().setZoomLevel(cur().getZoomLevel() + 0.5) },
      { label: 'Zoom out', accelerator: 'CmdOrCtrl+-', click: () => cur() && cur().setZoomLevel(cur().getZoomLevel() - 0.5) },
      { label: 'Reset zoom', accelerator: 'CmdOrCtrl+0', click: () => cur() && cur().setZoomLevel(0) }] },
    { role: 'windowMenu' },
    { label: 'Help', submenu: [{ label: 'Lareon help', click: () => shell.openExternal('https://lareon.org/help.html') }, { label: 'Contact help@lareon.org', click: () => shell.openExternal('mailto:help@lareon.org') }] }
  ]));
  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
