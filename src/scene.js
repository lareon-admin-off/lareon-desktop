// A quiet night scene: twinkling stars and layered mountains along the bottom edge.
(function () {
  var css = '.scene{position:fixed;left:0;right:0;bottom:0;height:46vh;min-height:230px;pointer-events:none;z-index:0;overflow:hidden}' +
    '.scene svg{position:absolute;inset:0;width:100%;height:100%}' +
    '.scene.stars{top:0;bottom:auto;height:60vh}' +
    '.sc-star{animation:scTw 4s ease-in-out infinite}' +
    '@keyframes scTw{0%,100%{opacity:.25}50%{opacity:1}}' +
    '.sc-m1{animation:scDrift 40s ease-in-out infinite alternate}.sc-m2{animation:scDrift 55s ease-in-out infinite alternate-reverse}' +
    '@keyframes scDrift{from{transform:translateX(-14px)}to{transform:translateX(14px)}}' +
    '@media(prefers-reduced-motion:reduce){.sc-star,.sc-m1,.sc-m2{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var stars = '';
  for (var i = 0; i < 70; i++) {
    var x = (rnd() * 100).toFixed(2), y = (rnd() * 100).toFixed(2), r = (0.5 + rnd() * 1.3).toFixed(2), d = (rnd() * 4).toFixed(2), o = (0.4 + rnd() * 0.6).toFixed(2);
    stars += '<circle class="sc-star" cx="' + x + '%" cy="' + y + '%" r="' + r + '" fill="#fff" opacity="' + o + '" style="animation-delay:-' + d + 's;animation-duration:' + (3 + rnd() * 4).toFixed(1) + 's"/>';
  }
  window.mountScene = function () {
    var d = document.createElement('div');
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML =
      '<div class="scene stars"><svg preserveAspectRatio="none">' + stars + '</svg></div>' +
      '<div class="scene"><svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">' +
      '<defs><linearGradient id="scg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a63"/><stop offset="1" stop-color="#1b1530"/></linearGradient>' +
      '<linearGradient id="scg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2048"/><stop offset="1" stop-color="#171227"/></linearGradient>' +
      '<linearGradient id="scg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1635"/><stop offset="1" stop-color="#13111b"/></linearGradient>' +
      '<radialGradient id="scglow" cx="50%" cy="100%" r="60%"><stop offset="0" stop-color="#ff7c1f" stop-opacity=".22"/><stop offset="1" stop-color="#ff7c1f" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="1440" height="400" fill="url(#scglow)"/>' +
      '<g class="sc-m2"><path d="M-40 400V250L120 170L230 235L360 120L500 250L610 190L740 270L860 150L1000 245L1120 175L1260 260L1380 190L1480 250V400Z" fill="url(#scg1)"/>' +
      '<path d="M360 120L330 150L352 146L366 162L378 144L398 150Z M860 150L830 182L852 176L868 194L880 174L900 180Z" fill="#6a5aa0" opacity=".55"/></g>' +
      '<g class="sc-m1"><path d="M-40 400V300L90 240L200 290L330 215L470 300L580 260L700 320L830 235L960 305L1090 250L1220 310L1340 255L1480 320V400Z" fill="url(#scg2)"/></g>' +
      '<path d="M0 400V335L110 300L240 340L380 290L520 345L650 318L790 355L930 310L1070 350L1200 322L1330 352L1440 330V400Z" fill="url(#scg3)"/>' +
      '</svg></div>';
    document.body.insertBefore(d, document.body.firstChild);
    return d;
  };
})();
