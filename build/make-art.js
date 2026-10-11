// Draws the app icon and the Windows setup wizard pictures from the logos in build/art. Needs: npm install --no-save sharp
const fs = require('fs');
const path = require('path');

const art = (n) => fs.readFileSync(path.join(__dirname, 'art', n), 'utf8');
function nested(name, prefix, x, y, size) {
  const s = art(name);
  const vb = s.match(/viewBox="([^"]+)"/)[1];
  let inner = s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  inner = inner.replace(/id="(\w+)"/g, 'id="' + prefix + '$1"').replace(/url\(#(\w+)\)/g, 'url(#' + prefix + '$1)');
  return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="' + vb + '">' + inner + '</svg>';
}
const FONT = 'Segoe UI, Arial, Helvetica, sans-serif';
const wordmark = (x, y, size, anchor) => '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" font-family="' + FONT + '" font-size="' + size + '" font-weight="600" fill="#f3eee8">Lareon</text>';

function sideSvg() {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="164" height="314" viewBox="0 0 164 314">' +
    '<defs><radialGradient id="bg" cx="50%" cy="100%" r="90%"><stop offset="0" stop-color="#4a2468"/><stop offset=".45" stop-color="#241a38"/><stop offset="1" stop-color="#141119"/></radialGradient></defs>' +
    '<rect width="164" height="314" fill="url(#bg)"/>' +
    '<text x="82" y="34" text-anchor="middle" font-family="' + FONT + '" font-size="9.5" letter-spacing="1" fill="#b9a9d0">DUSK &#183; FLEDGE &#183; ASTER</text>' +
    nested('dusk-icon.svg', 'pa_', 22, 58, 40) + nested('fledge-logo.svg', 'pb_', 62, 84, 40) + nested('aster-logo.svg', 'pc_', 102, 58, 40) +
    '<g fill="none" stroke="#ff8a2b" stroke-width="1.2" stroke-opacity=".55" stroke-dasharray="2 3"><path d="M42 100 C42 135 82 140 82 168"/><path d="M82 128 L82 168"/><path d="M122 100 C122 135 82 140 82 168"/></g>' +
    nested('lareon-icon.svg', 'pd_', 40, 172, 84) + wordmark(82, 288, 26, 'middle') +
    '<text x="82" y="303" text-anchor="middle" font-family="' + FONT + '" font-size="10.5" fill="#a79db8">All of it, in one place</text></svg>';
}
function headSvg() {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="57" viewBox="0 0 150 57"><rect width="150" height="57" fill="#141119"/>' +
    nested('lareon-icon.svg', 'pe_', 24, 11, 34) + wordmark(64, 35, 17, 'start') + '</svg>';
}
function iconSvg() {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">' + nested('lareon-icon.svg', 'pf_', -193, -221, 1410) + '</svg>';
}
// 24-bit BMP from raw top-down RGB, the format the Windows installer wants
function bmp(raw, w, h) {
  const row = Math.ceil((w * 3) / 4) * 4;
  const size = 54 + row * h;
  const b = Buffer.alloc(size);
  b.write('BM', 0); b.writeUInt32LE(size, 2); b.writeUInt32LE(54, 10); b.writeUInt32LE(40, 14);
  b.writeInt32LE(w, 18); b.writeInt32LE(h, 22); b.writeUInt16LE(1, 26); b.writeUInt16LE(24, 28); b.writeUInt32LE(row * h, 34);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = (y * w + x) * 3;
      const d = 54 + (h - 1 - y) * row + x * 3;
      b[d] = raw[s + 2]; b[d + 1] = raw[s + 1]; b[d + 2] = raw[s];
    }
  }
  return b;
}
async function main() {
  const sharp = require('sharp');
  const out = (n) => path.join(__dirname, n);
  const flat = async (svg, w, h) => sharp(Buffer.from(svg), { density: 216 }).resize(w, h).flatten({ background: '#141119' }).removeAlpha().raw().toBuffer();
  await sharp(Buffer.from(iconSvg()), { density: 72 }).resize(1024, 1024).png().toFile(out('icon.png'));
  fs.writeFileSync(out('installerSidebar.bmp'), bmp(await flat(sideSvg(), 164, 314), 164, 314));
  fs.writeFileSync(out('installerHeader.bmp'), bmp(await flat(headSvg(), 150, 57), 150, 57));
  console.log('art ready');
}
module.exports = { sideSvg, headSvg, iconSvg, bmp };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
