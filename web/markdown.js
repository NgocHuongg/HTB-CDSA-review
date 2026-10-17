(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function slugify(text) {
    return String(text).toLowerCase()
      .replace(/đ/g, 'd')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim().replace(/\s+/g, '-') || 'section';
  }

  const RE = {
    fence: /^( {0,3})(`{3,}|~{3,})[ \t]*([^\s`]*)(.*)$/,
    atx: /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/,
    hr: /^ {0,3}(?:(?:-[ \t]*){3,}|(?:\*[ \t]*){3,}|(?:_[ \t]*){3,})$/,
    bq: /^ {0,3}> ?/,
    li: /^( *)([-*+]|\d{1,9}[.)])(?:[ \t]+(.*)|$)/,
    tableDelim: /^ *\|? *:?-+:? *(?:\| *:?-+:? *)*\|? *$/,
    htmlBlock: /^ {0,3}<\/?(?:div|details|summary|table|thead|tbody|tr|td|th|p|img|figure|figcaption|center|section|aside|ul|ol|li|pre|h[1-6]|hr|br|video|iframe|blockquote|dl|dt|dd|!--)(?=[\s>/]|$)/i,
    setext1: /^ {0,3}=+[ \t]*$/,
    setext2: /^ {0,3}-+[ \t]*$/,
  };

  const PROMPT_RE = /^((?:PS )?[A-Za-z]:\\[^\n]*?&gt; ?|[\w.-]+@[\w.-]+(?:\[[^\]\n]*\]|:[^$#\n]*)?[$#] ?|[$#] )/;
  const CALLOUT_TITLES = { note: 'Note', tip: 'Tip', important: 'Important', warning: 'Warning', caution: 'Caution', info: 'Info', danger: 'Danger' };

  function fixHtml(html, ctx) {
    let h = String(html)
      .replace(/<(script|style|iframe|object|embed)\b[\s\S]*?<\/\1\s*>/gi, '')
      .replace(/<\/?(script|style|iframe|object|embed|link|meta|base|form)\b[^>]*>/gi, '')
      .replace(/\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    h = h.replace(/(\s(?:src|href)\s*=\s*)("([^"]*)"|'([^']*)')/gi, (m, pre, q, a, b) => {
      let u = a !== undefined ? a : b;
      if (/^\s*(javascript|vbscript|data:text\/html)/i.test(u)) u = '#';
      else if (ctx && ctx.resolve) u = ctx.resolve(u);
      return pre + '"' + esc(u) + '"';
    });
    return h;
  }

  function inline(src, ctx) {
    ctx = ctx || {};
    const store = [];
    const stash = (html) => '\u0000' + (store.push(html) - 1) + '\u0000';

    function linkHtml(href, inner, title) {
      const t = title ? ` title="${esc(title)}"` : '';
      if (/^\s*javascript:/i.test(href)) href = '#';
      if (href.charAt(0) === '#' && href.length > 1) {
        let target = href.slice(1);
        try { target = decodeURIComponent(target); } catch (e) {}
        return `<a href="#" data-anchor="${esc(slugify(target))}"${t}>${inner}</a>`;
      }
      const url = /^(https?:|mailto:)/i.test(href) ? href : (ctx.resolve ? ctx.resolve(href) : href);
      return `<a href="${esc(url)}" target="_blank" rel="noopener"${t}>${inner}</a>`;
    }

    function run(s) {
      s = s.replace(/(`+)(?!`)([\s\S]*?[^`])\1(?!`)/g, (m, ticks, code) => {
        let c = code.replace(/\n/g, ' ');
        if (/^ [\s\S]* $/.test(c) && c.trim()) c = c.slice(1, -1);
        return stash('<code>' + esc(c) + '</code>');
      });
      s = s.replace(/\\([\\`*_{}[\]()#+\-.!|>~<"'])/g, (m, ch) => stash(esc(ch)));
      s = s.replace(/!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+["']([^"']*)["'])?\s*\)/g, (m, alt, src, title) => {
        const url = ctx.resolve ? ctx.resolve(src) : src;
        return stash(`<a class="md-img" href="${esc(url)}" target="_blank" rel="noopener"><img src="${esc(url)}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy"></a>`);
      });
      s = s.replace(/\[((?:[^[\]]|\[[^[\]]*\])*)\]\(\s*<?([^\s)>]*)>?(?:\s+["']([^"']*)["'])?\s*\)/g,
        (m, text, href, title) => stash(linkHtml(href, run(text), title)));
      s = s.replace(/<(https?:\/\/[^\s<>]+)>/g, (m, u) => stash(`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`));
      s = s.replace(/<\/?(?:br|kbd|sup|sub|mark|u|ins|del|s|span|b|i|em|strong|small|abbr|img|a)\b[^<>]*\/?>/gi, (m) => stash(fixHtml(m, ctx)));
      s = s.replace(/<\/(?:p|div)\s*>/gi, '');
      s = s.replace(/(^|[\s(])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"*_])/g,
        (m, pre, u) => pre + stash(`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`));

      s = esc(s);

      s = s.replace(/\*\*\*(?=\S)([\s\S]*?\S)\*\*\*/g, '<strong><em>$1</em></strong>');
      s = s.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/(^|[^\p{L}\p{N}_])__(?=\S)([\s\S]*?\S)__(?![\p{L}\p{N}_])/gu, '$1<strong>$2</strong>');
      s = s.replace(/(^|[^*])\*(?=[^\s*])([\s\S]*?[^\s*])\*(?!\*)/g, '$1<em>$2</em>');
      s = s.replace(/(^|[^\p{L}\p{N}_])_(?=[^\s_])([\s\S]*?[^\s_])_(?![\p{L}\p{N}_])/gu, '$1<em>$2</em>');
      s = s.replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<del>$1</del>');
      s = s.replace(/(?: {2,}|\\)\n/g, '<br>\n');
      return s;
    }

    let out = run(String(src));
    for (let guard = 0; guard < 20 && /\u0000\d+\u0000/.test(out); guard++) {
      out = out.replace(/\u0000(\d+)\u0000/g, (m, i) => store[+i]);
    }
    return out;
  }

  const indentOf = (l) => l.match(/^ */)[0].length;
  const deindent = (l, n) => l.replace(new RegExp('^ {0,' + n + '}'), '');

  function isFence(l) {
    const m = l.match(RE.fence);
    return !!m && !(m[2][0] === '`' && /`/.test(m[4]));
  }

  function isTableStart(lines, i) {
    return lines[i].includes('|') && i + 1 < lines.length &&
      lines[i + 1].includes('|') && lines[i + 1].includes('-') && RE.tableDelim.test(lines[i + 1]);
  }

  function isBlockStart(lines, i) {
    const l = lines[i];
    return isFence(l) || RE.atx.test(l) || RE.hr.test(l) || RE.bq.test(l) || RE.li.test(l) ||
      RE.htmlBlock.test(l) || isTableStart(lines, i);
  }

  function heading(level, text, ctx) {
    const plain = text.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*_~]/g, '');
    let id = slugify(plain);
    const n = ctx.ids[id] = (ctx.ids[id] || 0) + 1;
    if (n > 1) id += '-' + (n - 1);
    return `<h${level} id="md-${esc(id)}">${inline(text, ctx)}</h${level}>`;
  }

  function codeBlock(code, lang, ctx) {
    let html = esc(code);
    if (/session|console|terminal/i.test(lang) || /^(shell|bash|sh|zsh|cmd|powershell|pwsh)$/i.test(lang)) {
      html = html.split('\n').map((l) => l.replace(PROMPT_RE, '<span class="prompt">$1</span>')).join('\n');
    }
    return `<div class="code"><div class="code-head"><span class="code-lang">${esc(lang || 'code')}</span>` +
      `<button type="button" class="code-copy" data-copy>${esc(ctx.copyLabel || 'Copy')}</button></div>` +
      `<pre><code>${html}</code></pre></div>`;
  }

  function splitRow(line) {
    let s = line.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
    const cells = [];
    let cur = '', inCode = false;
    for (let k = 0; k < s.length; k++) {
      const ch = s[k];
      if (ch === '\\' && s[k + 1] === '|') { cur += '\\|'; k++; continue; }
      if (ch === '`') {
        if (inCode) inCode = false;
        else if (s.indexOf('`', k + 1) !== -1) inCode = true;
      }
      if (ch === '|' && !inCode) { cells.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    cells.push(cur.trim());
    return cells;
  }

  function table(head, aligns, rows, ctx) {
    const al = (i) => (aligns[i] ? ` style="text-align:${aligns[i]}"` : '');
    const cell = (c) => inline(c.replace(/\\\|/g, '|'), ctx);
    const th = head.map((c, i) => `<th${al(i)}>${cell(c)}</th>`).join('');
    const trs = rows.map((r) => '<tr>' + head.map((_, i) => `<td${al(i)}>${cell(r[i] || '')}</td>`).join('') + '</tr>').join('\n');
    return `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`;
  }

  function blockquote(buf, ctx) {
    const m = buf.length && buf[0].match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|DANGER)\][ \t]*(.*)$/i);
    if (m) {
      const type = m[1].toLowerCase();
      const title = m[2].trim() || CALLOUT_TITLES[type];
      return `<div class="callout callout-${type}"><div class="callout-title">${inline(title, ctx)}</div>${parseBlocks(buf.slice(1), ctx, false)}</div>`;
    }
    return `<blockquote>${parseBlocks(buf, ctx, false)}</blockquote>`;
  }

  function parseList(lines, start, ctx) {
    const first = lines[start].match(RE.li);
    const base = first[1].length;
    const ordered = /\d/.test(first[2]);
    const startNum = ordered ? parseInt(first[2], 10) : 1;
    const isSibling = (l) => {
      const m = l.match(RE.li);
      return !!m && m[1].length >= base && m[1].length <= base + 1 && /\d/.test(m[2]) === ordered && !RE.hr.test(l);
    };
    const items = [];
    let loose = false;
    let i = start;

    while (i < lines.length && isSibling(lines[i])) {
      const m = lines[i].match(RE.li);
      const ind = m[1].length, mw = m[2].length;
      const rest = lines[i].slice(ind + mw);
      const sp = rest.match(/^[ \t]*/)[0].length;
      const content = rest.slice(sp);
      const cIndent = ind + mw + (content ? Math.min(Math.max(sp, 1), 4) : 1);
      const body = [content];
      let lastBlank = false, innerBlank = false;
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (!l.trim()) { body.push(''); lastBlank = true; i++; continue; }
        if (isSibling(l)) break;
        if (indentOf(l) > base) {
          if (lastBlank) innerBlank = true;
          body.push(deindent(l, cIndent));
          lastBlank = false; i++;
          continue;
        }
        if (!lastBlank && !isBlockStart(lines, i)) { body.push(l.trim()); i++; continue; }
        break;
      }
      while (body.length > 1 && !body[body.length - 1].trim()) body.pop();
      if (lastBlank && i < lines.length && isSibling(lines[i])) loose = true;
      if (innerBlank) loose = true;
      items.push(body);
    }

    const lis = items.map((body) => {
      let task = '';
      const tm = body[0].match(/^\[([ xX])\][ \t]+([\s\S]*)$/);
      if (tm) {
        task = `<input type="checkbox" disabled${tm[1] !== ' ' ? ' checked' : ''}> `;
        body[0] = tm[2];
      }
      return `<li${task ? ' class="task"' : ''}>${task}${parseBlocks(body, ctx, !loose)}</li>`;
    }).join('\n');
    const tag = ordered ? 'ol' : 'ul';
    const startAttr = ordered && startNum !== 1 ? ` start="${startNum}"` : '';
    return { html: `<${tag}${startAttr}>\n${lis}\n</${tag}>`, next: i };
  }

  function parseBlocks(lines, ctx, tight) {
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      let m;

      if (isFence(line)) {
        m = line.match(RE.fence);
        const indent = m[1].length, fence = m[2], lang = m[3] || '';
        const body = [];
        i++;
        while (i < lines.length) {
          const close = lines[i].match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
          if (close && close[1][0] === fence[0] && close[1].length >= fence.length) { i++; break; }
          body.push(indent ? deindent(lines[i], indent) : lines[i]);
          i++;
        }
        out.push(codeBlock(body.join('\n'), lang, ctx));
        continue;
      }
      if ((m = line.match(RE.atx))) {
        out.push(heading(m[1].length, (m[2] || '').trim(), ctx));
        i++;
        continue;
      }
      if (RE.hr.test(line)) { out.push('<hr>'); i++; continue; }
      if (RE.bq.test(line)) {
        const buf = [];
        while (i < lines.length && lines[i].trim()) {
          if (RE.bq.test(lines[i])) buf.push(lines[i].replace(RE.bq, ''));
          else if (!isBlockStart(lines, i)) buf.push(lines[i]);
          else break;
          i++;
        }
        out.push(blockquote(buf, ctx));
        continue;
      }
      if (isTableStart(lines, i)) {
        const head = splitRow(line);
        const aligns = splitRow(lines[i + 1]).map((c) => {
          c = c.trim();
          if (c.startsWith(':') && c.endsWith(':')) return 'center';
          if (c.endsWith(':')) return 'right';
          if (c.startsWith(':')) return 'left';
          return '';
        });
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].trim() && lines[i].includes('|')) { rows.push(splitRow(lines[i])); i++; }
        out.push(table(head, aligns, rows, ctx));
        continue;
      }
      if (RE.li.test(line)) {
        const res = parseList(lines, i, ctx);
        out.push(res.html);
        i = res.next;
        continue;
      }
      if (RE.htmlBlock.test(line)) {
        const buf = [];
        while (i < lines.length && lines[i].trim()) { buf.push(lines[i]); i++; }
        out.push(`<div class="md-html">${fixHtml(buf.join('\n'), ctx)}</div>`);
        continue;
      }

      const buf = [line.replace(/^\s+/, '')];
      let done = false;
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (!l.trim()) break;
        if (RE.setext1.test(l) || RE.setext2.test(l)) {
          out.push(heading(RE.setext1.test(l) ? 1 : 2, buf.join(' ').trim(), ctx));
          i++; done = true;
          break;
        }
        if (isBlockStart(lines, i)) break;
        buf.push(l.replace(/^\s+/, ''));
        i++;
      }
      if (!done) {
        const text = buf.join('\n');
        const html = inline(text, ctx);
        const onlyImages = /^(\s*!\[[^\]]*\]\([^)]*\)\s*)+$/.test(text);
        if (tight && !onlyImages) out.push(html);
        else out.push(`<p${onlyImages ? ' class="md-figure"' : ''}>${html}</p>`);
      }
    }
    return out.join('\n');
  }

  function render(md, opts) {
    const ctx = Object.assign({ ids: {}, resolve: null, copyLabel: 'Copy' }, opts || {});
    const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n')
      .map((l) => l.replace(/^[ \t]+/, (ws) => ws.replace(/\t/g, '    ')));
    return parseBlocks(lines, ctx, false);
  }

  global.MiniMD = { render, inline, slugify, esc };
})(window);
