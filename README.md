# Lareon for desktop

One app with every Lareon app as a tab: Dusk, Fledge, Aster, Rustle, Cove, Verse, Ward, Sheen, Lark and Grove (Ctrl or Cmd + 1 to 9). It opens the live sites, so every update to them reaches the app with no new release. Links from one app to another open in the right tab. The list of apps is src/apps.json; logos are in build/art.

## Build the installers
Open the Actions tab, choose Build Lareon installers, then Run workflow. When it finishes, download Lareon-windows, Lareon-mac and Lareon-linux from the run page.

## Run it on your computer
Needs Node 20 or newer: npm install, then python build/unpack_assets.py (needs Pillow), then npm start.
