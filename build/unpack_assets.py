# Turns build/assets.json into the files electron-builder needs: icon.png and the two setup wizard BMPs.
import base64, json, io, pathlib
from PIL import Image
here = pathlib.Path(__file__).resolve().parent
a = json.loads((here / 'assets.json').read_text())
img = lambda k: Image.open(io.BytesIO(base64.b64decode(a[k])))
img('icon').convert('RGBA').save(here / 'icon.png')
img('sidebar').convert('RGB').save(here / 'installerSidebar.bmp')
img('header').convert('RGB').save(here / 'installerHeader.bmp')
print('assets ready')
