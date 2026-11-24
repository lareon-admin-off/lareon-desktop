// Lareon's wallpapers. Each design has a dawn, day, dusk and night look. It follows the light or dark theme,
// or, with "Change with the time of day" on, the clock. window.wallPref = { wall, time } comes from the app's settings.
(function () {
  var css = '.wall{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;transition:opacity 1.2s var(--ease,ease)}.wall.mini{position:absolute;left:0;top:0;right:auto;bottom:auto;width:1280px;height:800px;transform-origin:0 0}.wall.fade{opacity:0}' +
    '.wall .sky{position:absolute;inset:0}.wall .ly{position:absolute;left:-4%;right:-4%;bottom:0;transition:transform .9s cubic-bezier(.2,.7,.2,1);will-change:transform}' +
    '.wall .ly>div{height:100%}.wall svg{display:block;width:100%;height:100%}' +
    '.wall .stars{position:absolute;inset:0 0 35% 0;transition:opacity 1s}' +
    '.wall .orb{position:absolute;border-radius:50%;animation:wOrb 18s ease-in-out infinite alternate;mix-blend-mode:screen}' +
    '.wall .glow{position:absolute;left:0;right:0;bottom:0;height:70%}' +
    '.wall .veil{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,var(--bg) 130%);opacity:.55}' +
    '.wall .rib{position:absolute;left:-20%;width:140%;filter:blur(28px);mix-blend-mode:screen;animation:wRib 18s ease-in-out infinite alternate;transform-origin:50% 50%}' +
    '.wall .blob{position:absolute;border-radius:50%;filter:blur(60px);animation:wBlob 26s ease-in-out infinite alternate}' +
    '.wall .neb{position:absolute;border-radius:50%;filter:blur(40px);animation:wNeb 40s ease-in-out infinite alternate}' +
    '.wall .shim{animation:wShim 3.6s ease-in-out infinite}' +
    '.sc-star{animation:wTw 4s ease-in-out infinite}' +
    '@keyframes wTw{0%,100%{opacity:.2}50%{opacity:1}}@keyframes wOrb{to{transform:translateY(14px) scale(1.04)}}' +
    '@keyframes wRib{0%{transform:translateX(-4%) skewY(-4deg) scaleY(.9)}50%{transform:translateX(3%) skewY(3deg) scaleY(1.15)}100%{transform:translateX(-2%) skewY(-2deg) scaleY(1)}}' +
    '@keyframes wBlob{0%{transform:translate(0,0) scale(1)}50%{transform:translate(6%,-5%) scale(1.12)}100%{transform:translate(-5%,4%) scale(.94)}}' +
    '@keyframes wNeb{to{transform:translate(4%,-3%) rotate(14deg) scale(1.08)}}@keyframes wShim{0%,100%{opacity:.25}50%{opacity:.9}}' +
    '.wall .d1{animation:wDr 46s ease-in-out infinite alternate}.wall .d2{animation:wDr 62s ease-in-out infinite alternate-reverse}.wall .d3{animation:wDr 80s ease-in-out infinite alternate}' +
    '@keyframes wDr{from{transform:translateX(-16px)}to{transform:translateX(16px)}}' +
    '.wall.mini *{animation-play-state:paused!important}' +
    '@media(prefers-reduced-motion:reduce){.wall *{animation:none!important;transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var seed = 11; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  function starField(n, s0) {
    seed = s0 || 11; var out = '';
    for (var i = 0; i < n; i++) {
      var x = (rnd() * 100).toFixed(2), y = (rnd() * 100).toFixed(2), r = (0.4 + rnd() * 1.3).toFixed(2), d = (rnd() * 6).toFixed(2), o = (0.4 + rnd() * 0.6).toFixed(2);
      out += '<circle class="sc-star" cx="' + x + '%" cy="' + y + '%" r="' + r + '" fill="#fff" opacity="' + o + '" style="animation-delay:-' + d + 's;animation-duration:' + (3 + rnd() * 5).toFixed(1) + 's"/>';
    }
    return out;
  }
  var uid = 0;
  function lin(id, a, b, vert) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vert === false ? 1 : 0) + '" y2="' + (vert === false ? 0 : 1) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }
  function sky(c) { return '<div class="sky" style="background:linear-gradient(180deg,' + c[0] + ',' + c[1] + ' 52%,' + c[2] + ')"></div>'; }
  function stars(op, n) { return op > 0 ? '<div class="stars" style="opacity:' + op + '"><svg preserveAspectRatio="none">' + starField(n || 90) + '</svg></div>' : ''; }
  // no sun or moon disc: just the soft light it would give off, behind the hills
  function orb() { return ''; } // no sun, moon or glow: the sky's own colours carry the light
  function glow() { return ''; }
  function layer(h, p, drift, vb, body) { return '<div class="ly" data-p="' + p + '" style="height:' + h + '"><div class="' + drift + '"><svg viewBox="' + vb + '" preserveAspectRatio="xMidYMax slice">' + body + '</svg></div></div>'; }

  // ---- the designs ----
  var P = {};
  // Peaks: Lareon's mountains (the original wallpaper)
  P.peaks = {
    name: 'Peaks', acc: ['#ff7c1f', '#d94fc4', '#a35cf5'],
    night: { sky: ['#0b0914', '#1a1230', '#3b2360'], orb: '#fff3df', oglow: 'rgba(255,200,150,.28)', ox: '78%', oy: '13%', glow: 'rgba(255,124,31,.2)', m: [['#5a4a92', '#2c2250'], ['#3a2c66', '#1b1530'], ['#271d46', '#120f1d']], snow: 'rgba(185,170,240,.55)', star: 1 },
    dawn: { sky: ['#3a2a63', '#c86a8e', '#ffb57a'], orb: '#ffe0b0', oglow: 'rgba(255,150,90,.55)', ox: '20%', oy: '40%', glow: 'rgba(255,120,80,.4)', m: [['#7a5a9e', '#4a3470'], ['#5a3f80', '#33245a'], ['#3a2756', '#1e1533']], snow: 'rgba(255,210,220,.6)', star: .3 },
    day: { sky: ['#aebbf2', '#d9c9f1', '#ffdcc4'], orb: '#fff6e0', oglow: 'rgba(255,168,92,.6)', ox: '74%', oy: '10%', glow: 'rgba(255,150,80,.35)', m: [['#a58bd6', '#8a72c0'], ['#8c72c6', '#7159ad'], ['#6f58a8', '#54418a']], snow: 'rgba(255,255,255,.8)', star: 0 },
    dusk: { sky: ['#1d1440', '#7a2f6e', '#ff7a4a'], orb: '#ffc27a', oglow: 'rgba(255,110,60,.5)', ox: '68%', oy: '38%', glow: 'rgba(255,90,60,.35)', m: [['#5c3a7e', '#331f52'], ['#3f2862', '#1f1538'], ['#2a1a45', '#130d22']], snow: 'rgba(255,180,200,.5)', star: .5 },
    draw: function (c, id) {
      return sky(c.sky) + stars(c.star) + orb(c) + glow(c.glow) +
        layer('64%', 6, 'd3', '0 0 1440 520', '<defs>' + lin(id + 'a', c.m[0][0], c.m[0][1]) + '</defs><path d="M-60 520V330L90 250L190 310L330 170L450 290L560 230L700 330L830 120L950 260L1070 190L1200 300L1330 210L1500 330V520Z" fill="url(#' + id + 'a)"/><path d="M330 170L292 214L322 206L338 228L354 202L384 214Z M830 120L784 182L820 172L838 204L858 168L898 184Z" fill="' + c.snow + '"/>') +
        layer('50%', 12, 'd2', '0 0 1440 420', '<defs>' + lin(id + 'b', c.m[1][0], c.m[1][1]) + '</defs><path d="M-60 420V300L100 220L220 290L360 190L500 300L610 250L740 330L880 210L1010 300L1140 230L1270 310L1400 250L1500 310V420Z" fill="url(#' + id + 'b)"/><path d="M360 190L330 224L352 218L366 236L380 216L402 224Z" fill="' + c.snow + '" opacity=".6"/>') +
        layer('34%', 20, 'd1', '0 0 1440 300', '<defs>' + lin(id + 'c', c.m[2][0], c.m[2][1]) + '</defs><path d="M-60 300V210L120 160L260 220L410 140L560 225L700 185L850 240L1000 170L1150 235L1290 190L1500 240V300Z" fill="url(#' + id + 'c)"/>');
    }
  };
  // Aurora: northern lights over a snowy ridge
  P.aurora = {
    name: 'Aurora', acc: ['#2fd1a0', '#3aa8f0', '#8a6cf0'],
    night: { sky: ['#040812', '#0a1a2c', '#122a3a'], r: ['#3ddca0', '#4ab8ff', '#a35cf5'], hill: ['#1a2a3c', '#0a121c'], hill2: ['#24374c', '#101a28'], star: 1 },
    dawn: { sky: ['#1a1838', '#5a3a6e', '#e08a8a'], r: ['#78f0be', '#ffaac8', '#be8cff'], hill: ['#3a3558', '#221e3a'], hill2: ['#4a4268', '#2c2748'], star: .35 },
    day: { sky: ['#8fb6e6', '#c4d8f2', '#efe4f6'], r: ['#2fc79a', '#4a8ff0', '#9a6af0'], hill: ['#c3cfe6', '#9eaccc'], hill2: ['#dfe6f3', '#b8c4dc'], star: 0 },
    dusk: { sky: ['#0b1024', '#2a2250', '#7a3a6a'], r: ['#3ddca0', '#ff7cb4', '#a35cf5'], hill: ['#24203e', '#110f20'], hill2: ['#302a50', '#18152a'], star: .7 },
    draw: function (c, id) {
      // curtains of light: a wavy lower edge that glows, fading upward
      var cur = function (col, k, top, d, dur) {
        var y0 = 150, pts = 'M-40 ' + y0;
        seed = 31 + k * 7; for (var x = 0; x <= 1480; x += 240) pts += ' Q' + (x + 120) + ' ' + (y0 + (rnd() - .5) * 110).toFixed(0) + ' ' + (x + 240) + ' ' + (y0 + (rnd() - .5) * 30).toFixed(0);
        pts += ' L1520 0 L-40 0Z';
        return '<div class="rib" style="top:' + top + ';height:40%;filter:blur(16px);opacity:.9;animation-delay:-' + d + 's;animation-duration:' + dur + 's"><svg viewBox="0 0 1440 200" preserveAspectRatio="none"><defs><linearGradient id="' + id + 'r' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + col + '" stop-opacity="0"/><stop offset=".72" stop-color="' + col + '" stop-opacity=".55"/><stop offset="1" stop-color="' + col + '"/></linearGradient></defs><path d="' + pts + '" fill="url(#' + id + 'r' + k + ')"/></svg></div>';
      };
      return sky(c.sky) + stars(c.star, 120) + cur(c.r[2], 3, '0%', 11, 29) + cur(c.r[0], 1, '6%', 0, 18) + cur(c.r[1], 2, '14%', 6, 23) +
        layer('40%', 10, 'd2', '0 0 1440 360', '<defs>' + lin(id + 'a', c.hill2[0], c.hill2[1]) + '</defs><path d="M-60 360V250C160 190 300 170 480 210S820 280 1000 220S1320 160 1500 200V360Z" fill="url(#' + id + 'a)"/>') +
        layer('26%', 18, 'd1', '0 0 1440 240', '<defs>' + lin(id + 'b', c.hill[0], c.hill[1]) + '</defs><path d="M-60 240V160C140 120 340 150 540 130S900 90 1100 140S1380 150 1500 130V240Z" fill="url(#' + id + 'b)"/>');
    }
  };
  // Dunes: warm desert curves under a big sun
  P.dunes = {
    name: 'Dunes', acc: ['#f08a3c', '#e0605a', '#b8547a'],
    night: { sky: ['#0d0b1a', '#22183a', '#4a2f4e'], orb: '#f5ecdc', oglow: 'rgba(255,230,200,.2)', ox: '22%', oy: '14%', os: 60, glow: 'rgba(255,150,90,.15)', d: [['#5a3a5e', '#3a2440'], ['#46304e', '#2a1c34'], ['#33233c', '#1a1222']], star: 1 },
    dawn: { sky: ['#5a4a8a', '#ff9a8a', '#ffd2a0'], orb: '#fff0c8', oglow: 'rgba(255,170,100,.6)', ox: '64%', oy: '44%', os: 96, glow: 'rgba(255,150,90,.4)', d: [['#f0a878', '#c9785a'], ['#d88660', '#a85c48'], ['#b0604a', '#7a3c34']], star: .15 },
    day: { sky: ['#8ec5f2', '#c4e0f6', '#ffe8c8'], orb: '#fffbe8', oglow: 'rgba(255,220,140,.7)', ox: '72%', oy: '10%', os: 84, glow: 'rgba(255,200,120,.35)', d: [['#f6cf96', '#e6aa6a'], ['#eab27a', '#d18e56'], ['#d8925c', '#b46e40']], star: 0 },
    dusk: { sky: ['#2a1a4a', '#c0446a', '#ff9a4a'], orb: '#ffcf80', oglow: 'rgba(255,120,60,.6)', ox: '30%', oy: '46%', os: 110, glow: 'rgba(255,100,60,.4)', d: [['#c25a5a', '#8a3a4a'], ['#9a4050', '#6a2a40'], ['#6a2a40', '#3a1828']], star: .4 },
    draw: function (c, id) {
      return sky(c.sky) + stars(c.star) + orb(c) + glow(c.glow) +
        layer('52%', 6, 'd3', '0 0 1440 440', '<defs>' + lin(id + 'a', c.d[0][0], c.d[0][1]) + '</defs><path d="M-60 440V300C120 220 300 200 520 250S900 340 1100 260S1400 200 1500 230V440Z" fill="url(#' + id + 'a)"/>') +
        layer('40%', 12, 'd2', '0 0 1440 340', '<defs>' + lin(id + 'b', c.d[1][0], c.d[1][1]) + '</defs><path d="M-60 340V230C200 260 360 150 640 190S1040 270 1240 200S1440 170 1500 180V340Z" fill="url(#' + id + 'b)"/>') +
        layer('26%', 20, 'd1', '0 0 1440 240', '<defs>' + lin(id + 'c', c.d[2][0], c.d[2][1]) + '</defs><path d="M-60 240V170C220 120 420 180 700 150S1160 100 1500 150V240Z" fill="url(#' + id + 'c)"/>');
    }
  };
  // Tide: open sea with the sun or moon shining on the water
  P.tide = {
    name: 'Tide', acc: ['#2fa8e0', '#3c7cf0', '#6a5cf0'],
    night: { sky: ['#050a18', '#0e1c36', '#1e3558'], orb: '#eef2ff', oglow: 'rgba(200,220,255,.25)', ox: '58%', oy: '18%', os: 64, sea: ['#14284a', '#060c1a'], w: ['#1c3a62', '#102240'], shine: 'rgba(220,230,255,.6)', star: 1 },
    dawn: { sky: ['#40366e', '#d07a96', '#ffc49a'], orb: '#fff0d0', oglow: 'rgba(255,170,120,.6)', ox: '44%', oy: '40%', os: 90, sea: ['#7a5a8a', '#2e2448'], w: ['#9a6a8e', '#5a3e6a'], shine: 'rgba(255,210,170,.75)', star: .2 },
    day: { sky: ['#7fb8ec', '#b8dcf6', '#e8f4fb'], orb: '#fffbe8', oglow: 'rgba(255,240,180,.7)', ox: '62%', oy: '12%', os: 80, sea: ['#3d8fc8', '#1d5e96'], w: ['#5aa8dc', '#2e78b4'], shine: 'rgba(255,255,255,.75)', star: 0 },
    dusk: { sky: ['#1a1440', '#8a3a72', '#ff8a52'], orb: '#ffc46e', oglow: 'rgba(255,120,60,.6)', ox: '48%', oy: '42%', os: 104, sea: ['#4a2a5a', '#160e26'], w: ['#6a3a62', '#341f44'], shine: 'rgba(255,170,100,.8)', star: .45 },
    draw: function (c, id) {
      var shine = '', i, cx0 = parseFloat(c.ox) + 2;
      seed = 7; for (i = 0; i < 22; i++) { var y = 4 + i * 4.2 + rnd() * 2, w = (3 + rnd() * 9) * (1 + i * .06), o = (rnd() - .5) * (4 + i * .5); shine += '<rect class="shim" x="' + (cx0 - w / 2 + o).toFixed(1) + '%" y="' + y.toFixed(1) + '%" width="' + w.toFixed(1) + '%" height="' + (0.7 + i * .05).toFixed(2) + '%" rx="1" fill="' + c.shine + '" style="animation-delay:-' + (rnd() * 3.6).toFixed(1) + 's;animation-duration:' + (2.6 + rnd() * 2.4).toFixed(1) + 's"/>'; }
      var cx = parseFloat(c.ox);
      return sky(c.sky) + stars(c.star) + orb(c) +
        '<div class="ly" data-p="4" style="height:46%"><div><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs>' + lin(id + 'a', c.sea[0], c.sea[1]) + '</defs><rect width="100" height="100" fill="url(#' + id + 'a)"/></svg></div></div>' +
        layer('20%', 14, 'd2', '0 0 1440 180', '<defs>' + lin(id + 'b', c.w[0], c.w[1]) + '</defs><path d="M-60 180V90C60 70 180 110 300 90S540 60 660 85S900 120 1020 92S1260 60 1380 88S1500 100 1500 100V180Z" fill="url(#' + id + 'b)" opacity=".85"/>') +
        layer('12%', 22, 'd1', '0 0 1440 120', '<path d="M-60 120V60C80 40 200 80 340 58S600 30 740 56S1000 84 1140 58S1400 40 1500 60V120Z" fill="' + c.sea[1] + '"/>');
    }
  };
  // Bloom: Lareon's own colours, drifting softly
  P.bloom = {
    name: 'Bloom', acc: ['#ff7c1f', '#d94fc4', '#a35cf5'],
    night: { bg: '#100d18', b: ['rgba(255,124,31,.45)', 'rgba(217,79,196,.42)', 'rgba(163,92,245,.5)', 'rgba(60,40,140,.6)'] },
    dawn: { bg: '#2a1a34', b: ['rgba(255,150,90,.6)', 'rgba(255,120,170,.5)', 'rgba(190,130,255,.45)', 'rgba(255,200,140,.5)'] },
    day: { bg: '#f4eefa', b: ['rgba(255,170,110,.55)', 'rgba(240,130,210,.4)', 'rgba(180,140,255,.5)', 'rgba(140,190,255,.4)'] },
    dusk: { bg: '#1a1022', b: ['rgba(255,110,50,.55)', 'rgba(230,70,150,.5)', 'rgba(140,70,230,.5)', 'rgba(255,170,80,.35)'] },
    draw: function (c) {
      var bl = function (col, l, t, s, d) { return '<div class="blob" style="left:' + l + ';top:' + t + ';width:' + s + ';height:' + s + ';background:' + col + ';animation-delay:-' + d + 's"></div>'; };
      return '<div class="sky" style="background:' + c.bg + '"></div>' + bl(c.b[0], '-10%', '-14%', '62%', 0) + bl(c.b[1], '46%', '-8%', '58%', 7) + bl(c.b[2], '18%', '42%', '66%', 13) + bl(c.b[3], '64%', '50%', '52%', 19);
    }
  };
  // Cosmos: deep space, nebula clouds and a ringed planet
  P.cosmos = {
    name: 'Cosmos', acc: ['#a35cf5', '#d94fc4', '#5a7cff'],
    night: { band: 'rgba(230,220,255,.22)', bg: ['#05040c', '#0c0a1e'], n: ['rgba(163,92,245,.45)', 'rgba(217,79,196,.32)', 'rgba(60,120,255,.3)'], pl: ['#ffb27a', '#a35cf5'], ring: 'rgba(255,220,200,.5)', star: 1 },
    dawn: { band: 'rgba(255,220,210,.22)', bg: ['#140c24', '#2a1638'], n: ['rgba(255,130,120,.4)', 'rgba(255,190,120,.3)', 'rgba(163,92,245,.35)'], pl: ['#ffd29a', '#d94fc4'], ring: 'rgba(255,230,210,.55)', star: .9 },
    day: { band: 'rgba(220,235,255,.25)', bg: ['#1c1a3a', '#34305e'], n: ['rgba(120,170,255,.45)', 'rgba(200,150,255,.4)', 'rgba(120,230,220,.3)'], pl: ['#bfe0ff', '#7a6cf0'], ring: 'rgba(230,240,255,.6)', star: .8 },
    dusk: { band: 'rgba(255,200,180,.2)', bg: ['#0e0716', '#24102a'], n: ['rgba(255,110,60,.4)', 'rgba(217,79,196,.4)', 'rgba(110,60,220,.35)'], pl: ['#ff9a5a', '#7a2f9e'], ring: 'rgba(255,200,170,.5)', star: 1 },
    draw: function (c, id) {
      var nb = function (col, l, t, w, h, d) { return '<div class="neb" style="left:' + l + ';top:' + t + ';width:' + w + ';height:' + h + ';background:radial-gradient(closest-side,' + col + ',transparent);animation-delay:-' + d + 's"></div>'; };
      return '<div class="sky" style="background:radial-gradient(120% 90% at 30% 20%,' + c.bg[1] + ',' + c.bg[0] + ')"></div>' + stars(c.star, 160) +
        nb(c.n[0], '-6%', '6%', '70%', '60%', 0) + nb(c.n[1], '40%', '28%', '64%', '56%', 12) + nb(c.n[2], '10%', '52%', '58%', '50%', 24) +
        '<div class="neb" style="left:-20%;top:20%;width:140%;height:34%;transform:rotate(-18deg);background:radial-gradient(closest-side,' + c.band + ',transparent);filter:blur(30px)"></div>';
    }
  };
  // Meadow: rolling green hills
  P.meadow = {
    name: 'Meadow', acc: ['#3fbf6a', '#2fb39a', '#3a8fd0'],
    night: { sky: ['#06101a', '#102236', '#1c3448'], oglow: 'rgba(190,220,255,.22)', ox: '70%', oy: '16%', glow: 'rgba(120,200,160,.12)', h: [['#1f3a3a', '#132626'], ['#173030', '#0d1c1e'], ['#0f2224', '#081416']], star: 1 },
    dawn: { sky: ['#4a5a8e', '#e8a0a0', '#ffd8a8'], oglow: 'rgba(255,190,130,.6)', ox: '24%', oy: '46%', glow: 'rgba(255,170,120,.3)', h: [['#7aa86a', '#4f7e52'], ['#5e9058', '#3e6a44'], ['#46744a', '#2c5236']], star: .15 },
    day: { sky: ['#7ec0ee', '#b8dcf4', '#e6f4e8'], oglow: 'rgba(255,250,210,.7)', ox: '76%', oy: '10%', glow: 'rgba(200,240,170,.35)', h: [['#9ad46a', '#6fb24e'], ['#78be56', '#4f9a3e'], ['#5aa448', '#3a7e34']], star: 0 },
    dusk: { sky: ['#232a52', '#b05a78', '#ffae6a'], oglow: 'rgba(255,150,90,.55)', ox: '70%', oy: '44%', glow: 'rgba(255,130,90,.3)', h: [['#4e6a4a', '#304a36'], ['#3a5640', '#223a2c'], ['#284432', '#142a20']], star: .4 },
    draw: function (c, id) {
      return sky(c.sky) + stars(c.star) + orb(c) + glow(c.glow) +
        layer('46%', 6, 'd3', '0 0 1440 400', '<defs>' + lin(id + 'a', c.h[0][0], c.h[0][1]) + '</defs><path d="M-60 400V260C140 200 320 190 520 230S880 300 1080 250S1400 200 1500 220V400Z" fill="url(#' + id + 'a)"/>') +
        layer('34%', 12, 'd2', '0 0 1440 300', '<defs>' + lin(id + 'b', c.h[1][0], c.h[1][1]) + '</defs><path d="M-60 300V190C200 140 420 210 680 170S1120 120 1500 180V300Z" fill="url(#' + id + 'b)"/>') +
        layer('22%', 20, 'd1', '0 0 1440 200', '<defs>' + lin(id + 'c', c.h[2][0], c.h[2][1]) + '</defs><path d="M-60 200V120C260 80 520 140 800 110S1260 70 1500 110V200Z" fill="url(#' + id + 'c)"/>');
    }
  };
  // Canyon: flat-topped red rock and long shadows
  P.canyon = {
    name: 'Canyon', acc: ['#e8703a', '#d0503a', '#a83a5a'],
    night: { sky: ['#0b0a16', '#1c1428', '#3a2234'], oglow: 'rgba(255,220,200,.16)', ox: '24%', oy: '14%', glow: 'rgba(255,120,80,.12)', r: [['#4a2a34', '#2c1820'], ['#3a2028', '#20121a'], ['#281820', '#140c12']], star: 1 },
    dawn: { sky: ['#4a3a72', '#e48a7a', '#ffcf98'], oglow: 'rgba(255,180,120,.65)', ox: '66%', oy: '44%', glow: 'rgba(255,140,90,.35)', r: [['#c8704e', '#9a4c38'], ['#a8563e', '#7a3a2e'], ['#7e3e30', '#532620']], star: .1 },
    day: { sky: ['#6aaee6', '#a8d2f0', '#f6e2c8'], oglow: 'rgba(255,240,200,.7)', ox: '30%', oy: '10%', glow: 'rgba(255,200,150,.3)', r: [['#e0905e', '#c26a40'], ['#c87446', '#a05432'], ['#a45a36', '#7a4024']], star: 0 },
    dusk: { sky: ['#1e1638', '#a03e5a', '#ff8a4a'], oglow: 'rgba(255,120,60,.6)', ox: '40%', oy: '46%', glow: 'rgba(255,90,60,.35)', r: [['#8a3e3a', '#5a2428'], ['#6a2e30', '#401a20'], ['#4a2026', '#2a1016']], star: .35 },
    draw: function (c, id) {
      return sky(c.sky) + stars(c.star) + orb(c) + glow(c.glow) +
        layer('50%', 6, 'd3', '0 0 1440 420', '<defs>' + lin(id + 'a', c.r[0][0], c.r[0][1]) + '</defs><path d="M-60 420V250H120L150 200H330L360 250H560V280H700L730 170H960L990 230H1120L1150 260H1500V420Z" fill="url(#' + id + 'a)"/>') +
        layer('36%', 12, 'd2', '0 0 1440 320', '<defs>' + lin(id + 'b', c.r[1][0], c.r[1][1]) + '</defs><path d="M-60 320V200H260L290 150H520L550 210H860L880 180H1110L1140 220H1500V320Z" fill="url(#' + id + 'b)"/>') +
        layer('20%', 20, 'd1', '0 0 1440 200', '<defs>' + lin(id + 'c', c.r[2][0], c.r[2][1]) + '</defs><path d="M-60 200V120C200 100 420 130 700 112S1200 96 1500 120V200Z" fill="url(#' + id + 'c)"/>');
    }
  };
  // Forest: rows of pines in the mist
  P.forest = {
    name: 'Forest', acc: ['#3fbf7a', '#2f9f8a', '#4a7fb0'],
    night: { sky: ['#050c12', '#0c1c24', '#183034'], oglow: 'rgba(200,230,255,.16)', ox: '64%', oy: '14%', mist: 'rgba(150,200,210,.10)', t: ['#1a3634', '#10262a', '#081618'], star: 1 },
    dawn: { sky: ['#3e4a78', '#c08a9a', '#f2c6a0'], oglow: 'rgba(255,200,150,.55)', ox: '30%', oy: '42%', mist: 'rgba(255,220,210,.35)', t: ['#5a6a7a', '#3e4e5c', '#25323c'], star: .1 },
    day: { sky: ['#8cc2e2', '#c6e0ec', '#eef3ea'], oglow: 'rgba(255,250,220,.6)', ox: '72%', oy: '10%', mist: 'rgba(255,255,255,.45)', t: ['#6a9a7a', '#4a7e5e', '#2e5e44'], star: 0 },
    dusk: { sky: ['#1a1a3a', '#7a3a5e', '#e8805a'], oglow: 'rgba(255,140,90,.5)', ox: '60%', oy: '44%', mist: 'rgba(255,170,140,.22)', t: ['#3a3048', '#262036', '#141020'], star: .35 },
    draw: function (c, id) {
      // pines: a short trunk and four or five uneven tiers of branches, never two alike
      var pine = function (x, base, h) {
        var w = h * (0.30 + rnd() * 0.08), tiers = 4 + Math.floor(rnd() * 2), top = base - h, d = 'M' + x.toFixed(1) + ' ' + top.toFixed(1), R = [], k, t, y, hw;
        for (k = 1; k <= tiers; k++) {
          t = k / tiers; y = top + h * (0.12 + 0.8 * t); hw = w / 2 * (0.25 + 0.75 * t) * (0.9 + rnd() * 0.2);
          R.push([x + hw, y + h * 0.02], [x + hw * (0.42 + rnd() * 0.12), y - h * 0.05]);
        }
        R.pop(); R.push([x + w * 0.05, base - h * 0.06], [x + w * 0.05, base]);
        for (k = 0; k < R.length; k++) d += ' L' + R[k][0].toFixed(1) + ' ' + R[k][1].toFixed(1);
        for (k = R.length - 1; k >= 0; k--) d += ' L' + (2 * x - R[k][0] + (rnd() - .5) * 2).toFixed(1) + ' ' + (R[k][1] + (rnd() - .5) * 3).toFixed(1);
        return d + 'Z';
      };
      var row = function (base, hmin, hmax, gap, s0) {
        seed = s0; var d = 'M-60 ' + (base + 2) + ' L1520 ' + (base + 2) + ' V420 H-60Z';
        for (var x = -40; x < 1500; x += gap * (0.45 + rnd() * 0.9)) d += pine(x, base + rnd() * 10, hmin + rnd() * (hmax - hmin));
        return d;
      };
      var mist = '<div class="glow" style="height:40%;background:linear-gradient(180deg,transparent,' + c.mist + ' 60%,transparent)"></div>';
      return sky(c.sky) + stars(c.star) + orb(c) +
        layer('54%', 3, 'd3', '0 0 1440 420', '<path d="M-60 420V250C160 200 360 230 560 205S960 170 1160 210S1420 220 1500 200V420Z" fill="' + c.t[0] + '" opacity=".55"/><path d="' + row(300, 40, 80, 22, 3) + '" fill="' + c.t[0] + '" opacity=".8"/>') + mist +
        layer('54%', 9, 'd2', '0 0 1440 420', '<path d="' + row(330, 70, 140, 34, 5) + '" fill="' + c.t[1] + '"/>') +
        layer('54%', 17, 'd1', '0 0 1440 420', '<path d="' + row(350, 140, 260, 70, 9) + '" fill="' + c.t[2] + '"/>');
    }
  };
  // Glacier: sharp icy peaks
  P.glacier = {
    name: 'Glacier', acc: ['#3ab4e8', '#5a8cf0', '#8a7cf0'],
    night: { sky: ['#040814', '#0a1830', '#16304e'], oglow: 'rgba(170,210,255,.22)', ox: '30%', oy: '14%', glow: 'rgba(120,180,255,.14)', m: [['#3a5a86', '#1c3254'], ['#2a4670', '#14263e'], ['#1a3050', '#0a1628']], ice: 'rgba(200,230,255,.6)', star: 1 },
    dawn: { sky: ['#3a4a82', '#c89ab8', '#ffd6c0'], oglow: 'rgba(255,200,180,.55)', ox: '70%', oy: '44%', glow: 'rgba(255,170,160,.3)', m: [['#a8b8dc', '#7a8cbc'], ['#8a9ccc', '#5e70a6'], ['#6a7caa', '#46568a']], ice: 'rgba(255,240,245,.85)', star: .15 },
    day: { sky: ['#7ab8f0', '#bcdcf6', '#eef6fc'], oglow: 'rgba(255,255,240,.6)', ox: '26%', oy: '10%', glow: 'rgba(200,230,255,.4)', m: [['#c4d8f0', '#94b4dc'], ['#a4c0e4', '#7498c8'], ['#84a4d0', '#5a7cb0']], ice: 'rgba(255,255,255,.95)', star: 0 },
    dusk: { sky: ['#141a40', '#6a4a8a', '#f0a08a'], oglow: 'rgba(255,170,140,.5)', ox: '60%', oy: '46%', glow: 'rgba(255,140,140,.25)', m: [['#5a6a9a', '#38467a'], ['#44527e', '#2a3660'], ['#2e3a62', '#1a2244']], ice: 'rgba(255,220,230,.7)', star: .4 },
    draw: function (c, id) {
      return sky(c.sky) + stars(c.star) + orb(c) + glow(c.glow) +
        layer('62%', 6, 'd3', '0 0 1440 520', '<defs>' + lin(id + 'a', c.m[0][0], c.m[0][1]) + '</defs><path d="M-60 520V360L120 240L210 300L380 120L470 230L600 170L760 330L900 90L1040 250L1180 160L1300 280L1500 200V520Z" fill="url(#' + id + 'a)"/><path d="M380 120L340 180L372 166L392 196L414 160L440 176Z M900 90L850 160L888 146L908 182L932 140L968 156Z M1180 160L1150 204L1176 196L1192 218L1208 194L1230 202Z" fill="' + c.ice + '"/>') +
        layer('44%', 12, 'd2', '0 0 1440 400', '<defs>' + lin(id + 'b', c.m[1][0], c.m[1][1]) + '</defs><path d="M-60 400V280L90 200L240 290L420 150L560 280L700 220L860 320L1020 170L1180 300L1320 220L1500 290V400Z" fill="url(#' + id + 'b)"/><path d="M420 150L392 192L418 184L432 206L448 180L470 190Z M1020 170L990 214L1016 204L1032 228L1050 200L1072 210Z" fill="' + c.ice + '" opacity=".7"/>') +
        layer('26%', 20, 'd1', '0 0 1440 240', '<defs>' + lin(id + 'c', c.m[2][0], c.m[2][1]) + '</defs><path d="M-60 240V170L160 120L330 180L520 100L700 170L880 130L1060 190L1260 120L1500 170V240Z" fill="url(#' + id + 'c)"/>');
    }
  };
  // Waves: flowing lines in Lareon's colours
  P.waves = {
    name: 'Waves', acc: ['#ff5c8a', '#c45cf0', '#5c7cff'],
    night: { bg: ['#0c0a18', '#16122a'], l: ['#ff7c1f', '#d94fc4', '#a35cf5', '#5c7cff'], o: .55 },
    dawn: { bg: ['#2a1c3e', '#4a2a4a'], l: ['#ffb07a', '#ff7cb4', '#c49cff', '#ffd6a0'], o: .6 },
    day: { bg: ['#f6f1fb', '#ece6f8'], l: ['#ff9a5a', '#e870c8', '#9a74f0', '#5c9cff'], o: .55 },
    dusk: { bg: ['#1a0e22', '#2e1430'], l: ['#ff6a3a', '#ff4f8a', '#b04ff0', '#ffa04a'], o: .6 },
    draw: function (c, id) {
      var lines = '', i, j;
      for (j = 0; j < 4; j++) {
        seed = 17 + j * 11; var g = id + 'g' + j;
        lines += '<defs><linearGradient id="' + g + '" x1="0" x2="1"><stop offset="0" stop-color="' + c.l[j] + '" stop-opacity="0"/><stop offset=".5" stop-color="' + c.l[j] + '"/><stop offset="1" stop-color="' + c.l[(j + 1) % 4] + '" stop-opacity="0"/></linearGradient></defs>';
        for (i = 0; i < 9; i++) {
          var y = 260 + j * 70 + i * 7, a = 50 + rnd() * 40, ph = rnd() * 300;
          lines += '<path d="M-100 ' + y + ' C' + (200 + ph) + ' ' + (y - a) + ' ' + (500 + ph) + ' ' + (y + a) + ' 760 ' + y + ' S1260 ' + (y - a) + ' 1540 ' + (y + 10) + '" fill="none" stroke="url(#' + g + ')" stroke-width="1.4" opacity="' + (c.o * (1 - i / 12)).toFixed(2) + '"/>';
        }
      }
      return '<div class="sky" style="background:linear-gradient(160deg,' + c.bg[0] + ',' + c.bg[1] + ')"></div>' +
        '<div class="ly" data-p="10" style="height:100%;left:-6%;right:-6%"><div class="d2"><svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">' + lines + '</svg></div></div>';
    }
  };
  // Calm: a quiet gradient, nothing moving
  P.calm = {
    name: 'Calm', acc: ['#ff7c1f', '#d94fc4', '#a35cf5'],
    night: { g: ['#16131f', '#1d1828', '#241c33'] }, dawn: { g: ['#2a2036', '#3a2a40', '#4a3044'] }, day: { g: ['#f3effa', '#efe9f7', '#f7ecef'] }, dusk: { g: ['#1c1424', '#2a1a2e', '#3a2030'] },
    draw: function (c) { return '<div class="sky" style="background:linear-gradient(160deg,' + c.g[0] + ',' + c.g[1] + ' 55%,' + c.g[2] + ')"></div>'; }
  };
  var ORDER = ['peaks', 'aurora', 'meadow', 'forest', 'glacier', 'canyon', 'dunes', 'tide', 'bloom', 'waves', 'cosmos', 'calm'];

  function themeDark() {
    var a = document.documentElement.getAttribute('data-theme');
    return a ? a === 'dark' : !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
  }
  function clockPhase(d) { var h = (d || new Date()).getHours(); return h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'dusk' : 'night'; }
  function mode(p) { return p && p.phase ? p.phase : (p && p.time ? 'auto' : 'theme'); }
  function phase(p) { var m = mode(p); return m === 'auto' ? clockPhase() : m === 'theme' ? (themeDark() ? 'night' : 'day') : m; }
  // the app's accent colours follow the wallpaper (buttons, switches, links, the sidebar marker)
  function tint(p, name) {
    var r = document.documentElement.style, a = (P[name] || P.peaks).acc;
    if (p && p.tint === false || !a) { ['--grad', '--orange', '--violet', '--acc-glow'].forEach(function (k) { r.removeProperty(k); }); return; }
    r.setProperty('--grad', 'linear-gradient(90deg,' + a[0] + ',' + a[1] + ' 60%,' + a[2] + ')'); r.setProperty('--orange', a[0]); r.setProperty('--violet', a[2]);
  }
  function build(name, ph, mini) {
    var S = P[name] || P.peaks, d = document.createElement('div');
    d.className = 'wall' + (mini ? ' mini' : ''); d.setAttribute('aria-hidden', 'true'); d.setAttribute('data-wall', name); d.setAttribute('data-phase', ph);
    d.innerHTML = S.draw(S[ph] || S.night, 'w' + (++uid) + '_') + (mini ? '' : '<div class="veil"></div>');
    return d;
  }
  var cur = null, pref = null, lys = [];
  function paint(animate) {
    var p = pref || window.wallPref || { wall: 'peaks', time: false }, ph = phase(p);
    tint(p, P[p.wall] ? p.wall : 'peaks');
    if (cur && cur.getAttribute('data-wall') === p.wall && cur.getAttribute('data-phase') === ph) return;
    var d = build(p.wall, ph, false), old = cur;
    if (old && animate) { d.classList.add('fade'); old.parentNode.insertBefore(d, old.nextSibling); void d.offsetWidth; d.classList.remove('fade'); setTimeout(function () { old.remove(); }, 1300); }
    else { if (old) old.remove(); document.body.insertBefore(d, document.body.firstChild); }
    cur = d; lys = d.querySelectorAll('.ly');
  }
  window.mountScene = function () {
    paint(false);
    window.addEventListener('pointermove', function (e) {
      var x = (e.clientX / innerWidth - 0.5), y = (e.clientY / innerHeight - 0.5);
      for (var i = 0; i < lys.length; i++) { var p = +lys[i].getAttribute('data-p'); lys[i].style.transform = 'translate(' + (-x * p).toFixed(1) + 'px,' + (-y * p * 0.5).toFixed(1) + 'px)'; }
    }, { passive: true });
    new MutationObserver(function () { paint(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.matchMedia) matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { paint(true); });
    setInterval(function () { paint(true); }, 60000);
    return cur;
  };
  window.wallpapers = {
    list: ORDER.map(function (k) { return { key: k, name: P[k].name }; }),
    set: function (p) { pref = p; paint(true); },
    // a small but true-to-life picture of a wallpaper: drawn at full size, then scaled to fit its box
    preview: function (name, ph) {
      var d = build(name, ph || phase(pref || window.wallPref), true);
      var fit = function () { var p = d.parentNode; if (!p || !p.clientWidth) return requestAnimationFrame(fit); var k = Math.max(p.clientWidth / 1280, p.clientHeight / 800); d.style.transform = 'translate(' + ((p.clientWidth - 1280 * k) / 2) + 'px,' + ((p.clientHeight - 800 * k) / 2) + 'px) scale(' + k + ')'; };
      requestAnimationFrame(fit); return d;
    },
    phase: function () { return phase(pref || window.wallPref); },
    accent: function (name) { return (P[name] || P.peaks).acc; }
  };
})();
