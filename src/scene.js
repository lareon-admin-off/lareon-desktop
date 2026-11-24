// Lareon's wallpapers. Each design has a dawn, day, dusk and night look. It follows the light or dark theme,
// or, with "Change with the time of day" on, the clock. window.wallPref = { wall, time } comes from the app's settings.
(function () {
  var css = '.wall{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;transition:opacity 1.2s var(--ease,ease)}.wall.mini{position:absolute;left:0;top:0;right:auto;bottom:auto;width:1280px;height:800px;transform-origin:0 0}.wall.fade{opacity:0}' +
    '.wall .sky{position:absolute;inset:0}.wall .ly{position:absolute;left:-4%;right:-4%;bottom:0;transition:transform .9s cubic-bezier(.2,.7,.2,1);will-change:transform}' +
    '.wall .ly>div{height:100%}.wall svg{display:block;width:100%;height:100%}' +
    '.wall .stars{position:absolute;inset:0 0 35% 0;transition:opacity 1s}' +
    '.wall .orb{position:absolute;border-radius:50%;animation:wOrb 14s ease-in-out infinite alternate}' +
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
  function orb(p) { return '<div class="orb" style="left:' + p.ox + ';top:' + p.oy + ';width:' + (p.os || 76) + 'px;height:' + (p.os || 76) + 'px;background:radial-gradient(circle at 38% 36%,#fff,' + p.orb + ' 60%);box-shadow:0 0 90px 30px ' + p.oglow + '"></div>'; }
  function glow(c) { return '<div class="glow" style="background:radial-gradient(60% 70% at 50% 100%,' + c + ',transparent 70%)"></div>'; }
  function layer(h, p, drift, vb, body) { return '<div class="ly" data-p="' + p + '" style="height:' + h + '"><div class="' + drift + '"><svg viewBox="' + vb + '" preserveAspectRatio="xMidYMax slice">' + body + '</svg></div></div>'; }

  // ---- the designs ----
  var P = {};
  // Peaks: Lareon's mountains (the original wallpaper)
  P.peaks = {
    name: 'Peaks',
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
    name: 'Aurora',
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
    name: 'Dunes',
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
    name: 'Tide',
    night: { sky: ['#050a18', '#0e1c36', '#1e3558'], orb: '#eef2ff', oglow: 'rgba(200,220,255,.25)', ox: '58%', oy: '18%', os: 64, sea: ['#14284a', '#060c1a'], w: ['#1c3a62', '#102240'], shine: 'rgba(220,230,255,.6)', star: 1 },
    dawn: { sky: ['#40366e', '#d07a96', '#ffc49a'], orb: '#fff0d0', oglow: 'rgba(255,170,120,.6)', ox: '44%', oy: '40%', os: 90, sea: ['#7a5a8a', '#2e2448'], w: ['#9a6a8e', '#5a3e6a'], shine: 'rgba(255,210,170,.75)', star: .2 },
    day: { sky: ['#7fb8ec', '#b8dcf6', '#e8f4fb'], orb: '#fffbe8', oglow: 'rgba(255,240,180,.7)', ox: '62%', oy: '12%', os: 80, sea: ['#3d8fc8', '#1d5e96'], w: ['#5aa8dc', '#2e78b4'], shine: 'rgba(255,255,255,.75)', star: 0 },
    dusk: { sky: ['#1a1440', '#8a3a72', '#ff8a52'], orb: '#ffc46e', oglow: 'rgba(255,120,60,.6)', ox: '48%', oy: '42%', os: 104, sea: ['#4a2a5a', '#160e26'], w: ['#6a3a62', '#341f44'], shine: 'rgba(255,170,100,.8)', star: .45 },
    draw: function (c, id) {
      var shine = '', i, cx0 = parseFloat(c.ox) + 2;
      seed = 7; for (i = 0; i < 22; i++) { var y = 4 + i * 4.2 + rnd() * 2, w = (3 + rnd() * 9) * (1 + i * .06), o = (rnd() - .5) * (4 + i * .5); shine += '<rect class="shim" x="' + (cx0 - w / 2 + o).toFixed(1) + '%" y="' + y.toFixed(1) + '%" width="' + w.toFixed(1) + '%" height="' + (0.7 + i * .05).toFixed(2) + '%" rx="1" fill="' + c.shine + '" style="animation-delay:-' + (rnd() * 3.6).toFixed(1) + 's;animation-duration:' + (2.6 + rnd() * 2.4).toFixed(1) + 's"/>'; }
      var cx = parseFloat(c.ox);
      return sky(c.sky) + stars(c.star) + orb(c) +
        '<div class="ly" data-p="4" style="height:46%"><div><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs>' + lin(id + 'a', c.sea[0], c.sea[1]) + '</defs><rect width="100" height="100" fill="url(#' + id + 'a)"/>' + shine + '</svg></div></div>' +
        layer('20%', 14, 'd2', '0 0 1440 180', '<defs>' + lin(id + 'b', c.w[0], c.w[1]) + '</defs><path d="M-60 180V90C60 70 180 110 300 90S540 60 660 85S900 120 1020 92S1260 60 1380 88S1500 100 1500 100V180Z" fill="url(#' + id + 'b)" opacity=".85"/>') +
        layer('12%', 22, 'd1', '0 0 1440 120', '<path d="M-60 120V60C80 40 200 80 340 58S600 30 740 56S1000 84 1140 58S1400 40 1500 60V120Z" fill="' + c.sea[1] + '"/>');
    }
  };
  // Bloom: Lareon's own colours, drifting softly
  P.bloom = {
    name: 'Bloom',
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
    name: 'Cosmos',
    night: { bg: ['#05040c', '#0c0a1e'], n: ['rgba(163,92,245,.45)', 'rgba(217,79,196,.32)', 'rgba(60,120,255,.3)'], pl: ['#ffb27a', '#a35cf5'], ring: 'rgba(255,220,200,.5)', star: 1 },
    dawn: { bg: ['#140c24', '#2a1638'], n: ['rgba(255,130,120,.4)', 'rgba(255,190,120,.3)', 'rgba(163,92,245,.35)'], pl: ['#ffd29a', '#d94fc4'], ring: 'rgba(255,230,210,.55)', star: .9 },
    day: { bg: ['#1c1a3a', '#34305e'], n: ['rgba(120,170,255,.45)', 'rgba(200,150,255,.4)', 'rgba(120,230,220,.3)'], pl: ['#bfe0ff', '#7a6cf0'], ring: 'rgba(230,240,255,.6)', star: .8 },
    dusk: { bg: ['#0e0716', '#24102a'], n: ['rgba(255,110,60,.4)', 'rgba(217,79,196,.4)', 'rgba(110,60,220,.35)'], pl: ['#ff9a5a', '#7a2f9e'], ring: 'rgba(255,200,170,.5)', star: 1 },
    draw: function (c, id) {
      var nb = function (col, l, t, w, h, d) { return '<div class="neb" style="left:' + l + ';top:' + t + ';width:' + w + ';height:' + h + ';background:radial-gradient(closest-side,' + col + ',transparent);animation-delay:-' + d + 's"></div>'; };
      return '<div class="sky" style="background:radial-gradient(120% 90% at 30% 20%,' + c.bg[1] + ',' + c.bg[0] + ')"></div>' + stars(c.star, 160) +
        nb(c.n[0], '-6%', '6%', '70%', '60%', 0) + nb(c.n[1], '40%', '28%', '64%', '56%', 12) + nb(c.n[2], '10%', '52%', '58%', '50%', 24) +
        '<div class="ly" data-p="14" style="left:auto;right:9%;bottom:auto;top:16%;width:190px;height:190px"><div class="d2"><svg viewBox="0 0 200 200"><defs><radialGradient id="' + id + 'p" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="' + c.pl[0] + '"/><stop offset="1" stop-color="' + c.pl[1] + '"/></radialGradient></defs>' +
        '<ellipse cx="100" cy="104" rx="96" ry="22" fill="none" stroke="' + c.ring + '" stroke-width="5" transform="rotate(-14 100 100)"/><circle cx="100" cy="100" r="52" fill="url(#' + id + 'p)"/>' +
        '<path d="M8 120 A96 22 0 0 0 192 88" fill="none" stroke="' + c.ring + '" stroke-width="5" transform="rotate(-14 100 100)" opacity=".9"/></svg></div></div>';
    }
  };
  // Calm: a quiet gradient, nothing moving
  P.calm = {
    name: 'Calm',
    night: { g: ['#16131f', '#1d1828', '#241c33'] }, dawn: { g: ['#2a2036', '#3a2a40', '#4a3044'] }, day: { g: ['#f3effa', '#efe9f7', '#f7ecef'] }, dusk: { g: ['#1c1424', '#2a1a2e', '#3a2030'] },
    draw: function (c) { return '<div class="sky" style="background:linear-gradient(160deg,' + c.g[0] + ',' + c.g[1] + ' 55%,' + c.g[2] + ')"></div>'; }
  };
  var ORDER = ['peaks', 'aurora', 'dunes', 'tide', 'bloom', 'cosmos', 'calm'];

  function themeDark() {
    var a = document.documentElement.getAttribute('data-theme');
    return a ? a === 'dark' : !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
  }
  function clockPhase(d) { var h = (d || new Date()).getHours(); return h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'dusk' : 'night'; }
  function phase(pref) { return pref && pref.time ? clockPhase() : (themeDark() ? 'night' : 'day'); }
  function build(name, ph, mini) {
    var S = P[name] || P.peaks, d = document.createElement('div');
    d.className = 'wall' + (mini ? ' mini' : ''); d.setAttribute('aria-hidden', 'true'); d.setAttribute('data-wall', name); d.setAttribute('data-phase', ph);
    d.innerHTML = S.draw(S[ph] || S.night, 'w' + (++uid) + '_') + (mini ? '' : '<div class="veil"></div>');
    return d;
  }
  var cur = null, pref = null, lys = [];
  function paint(animate) {
    var p = pref || window.wallPref || { wall: 'peaks', time: false }, ph = phase(p);
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
    phase: function () { return phase(pref || window.wallPref); }
  };
})();
