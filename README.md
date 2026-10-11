# Lareon for desktop

One app with Dusk, Fledge and Aster as tabs (Ctrl or Cmd + 1, 2, 3). It opens the live sites, so every update to them reaches the app with no new release.

## Build the installers
Open the Actions tab, choose Build Lareon installers, then Run workflow. When it finishes, download Lareon-windows, Lareon-mac and Lareon-linux from the run page.

## Run it on your computer
Needs Node 20 or newer: npm install, then python build/unpack_assets.py (needs Pillow), then npm start.
