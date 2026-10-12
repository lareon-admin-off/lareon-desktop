/* Small, safe markdown + math renderer for Aster text. window.mdRender(text) -> HTML */
(function () {
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function tex(src, display) {
    try { if (window.katex) return window.katex.renderToString(src, { displayMode: display, throwOnError: false, output: 'html', trust: false, strict: 'ignore' }); } catch (e) {}
    return '<code>' + esc(src) + '</code>';
  }
  function inline(s) {
    return s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }
  window.mdRender = function (text) {
    var maths = [];
    var s = String(text == null ? '' : text).replace(/\r/g, '');
    function keep(src, display) { maths.push(tex(src.trim(), display)); return '\u0001' + (maths.length - 1) + '\u0002'; }
    var codes = [];
    s = s.replace(/```[a-z]*\n?([\s\S]*?)```/g, function (m, c) { codes.push(c.replace(/\n$/, '')); return '\u0003' + (codes.length - 1) + '\u0004'; });
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, function (m, a) { return keep(a, true); })
         .replace(/\\\[([\s\S]+?)\\\]/g, function (m, a) { return keep(a, true); })
         .replace(/\\\(([\s\S]+?)\\\)/g, function (m, a) { return keep(a, false); })
         .replace(/(^|[^\\$\d])\$([^$\n]+?)\$(?!\d)/g, function (m, p, a) { return p + keep(a, false); });
    var lines = esc(s).split('\n'), out = [], list = null, para = [];
    function flushP() { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } }
    function flushL() { if (list) { out.push('</' + list + '>'); list = null; } }
    lines.forEach(function (ln) {
      var m;
      if (!ln.trim()) { flushP(); flushL(); return; }
      if ((m = ln.match(/^\s*(#{1,4})\s+(.*)$/))) { flushP(); flushL(); out.push('<h4>' + inline(m[2]) + '</h4>'); return; }
      if ((m = ln.match(/^\s*[-*•]\s+(.*)$/))) { flushP(); if (list !== 'ul') { flushL(); out.push('<ul>'); list = 'ul'; } out.push('<li>' + inline(m[1]) + '</li>'); return; }
      if ((m = ln.match(/^\s*\d+[.)]\s+(.*)$/))) { flushP(); if (list !== 'ol') { flushL(); out.push('<ol>'); list = 'ol'; } out.push('<li>' + inline(m[1]) + '</li>'); return; }
      if (/^\s*(---+|\*\*\*+)\s*$/.test(ln)) { flushP(); flushL(); out.push('<hr>'); return; }
      flushL(); para.push(ln.trim());
    });
    flushP(); flushL();
    var h = out.join('');
    h = h.replace(/\u0001(\d+)\u0002/g, function (m, i) { return maths[+i]; });
    h = h.replace(/\u0003(\d+)\u0004/g, function (m, i) { return '<pre><code>' + esc(codes[+i]) + '</code></pre>'; });
    return h;
  };
})();
