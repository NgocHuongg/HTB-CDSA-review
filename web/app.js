(function () {
  'use strict';

  const $app = document.getElementById('app');
  const LS_LANG = 'cdsa.lang';
  const SITE = 'HTB Certified Defensive Security Analyst';
  let lang = 'vi';
  try {
    const saved = localStorage.getItem(LS_LANG);
    if (saved === 'vi' || saved === 'en') lang = saved;
  } catch (e) {}

  const I18N = {
    vi: {
      'nav.modules': 'Module', 'nav.cheatsheets': 'Cheatsheet', 'nav.answers': 'Đáp án',
      'home.title': 'Module', 'home.sub': 'Chọn module để học theo từng section.',
      'home.empty': 'Chưa có module nào.', 'home.emptyHint': 'Tạo module trong thư mục',
      'sections': 'section', 'completed': 'Hoàn thành', 'open': 'Mở module',
      'module.start': 'Bắt đầu học', 'module.continue': 'Tiếp tục học', 'module.review': 'Ôn lại từ đầu',
      'module.reset': 'Làm lại module', 'module.resetConfirm': 'Bấm lần nữa để xoá tiến độ',
      'module.resetDone': 'Đã xoá tiến độ module.', 'module.sections': 'Danh sách section',
      'module.empty': 'Module này chưa có section nào.', 'module.emptyHint': 'Gửi nội dung để thêm, hoặc tạo thư mục section trong',
      'section.prev': 'Section trước', 'section.next': 'Section tiếp', 'section.markDone': 'Đánh dấu hoàn thành',
      'section.done': 'Đã hoàn thành', 'section.undoHint': 'Bấm để bỏ đánh dấu',
      'section.fallback': 'Section này chưa có bản tiếng Việt — đang hiển thị bản tiếng Anh.',
      'section.noContent': 'Section này chưa có nội dung.', 'section.toc': 'Nội dung module',
      'section.backToModule': 'Về trang module', 'section.finished': 'Bạn đã đi hết module này.',
      'cs.title': 'Cheatsheet', 'cs.sub': 'Toàn bộ file cheatsheet HTB — tải từng file hoặc tải tất cả một lần.',
      'cs.all': 'Tải tất cả (.zip)', 'cs.view': 'Xem', 'cs.download': 'Tải', 'cs.empty': 'Chưa có file cheatsheet nào.',
      'cs.emptyHint': 'Chép file cheatsheet vào thư mục', 'cs.root': 'Chung', 'cs.summary': '{n} file · {size}',
      'ans.title': 'Đáp án', 'ans.sub': 'Đáp án của các section có câu hỏi — mỗi section một mục riêng.',
      'ans.all': 'Tải tất cả (.md)', 'ans.module': 'Tải đáp án module (.md)', 'ans.empty': 'Chưa có section nào có câu hỏi.',
      'ans.alt': 'Cũng chấp nhận', 'ans.expand': 'Mở tất cả', 'ans.collapse': 'Thu gọn tất cả', 'ans.goto': 'Mở section',
      'copy': 'Copy', 'copied': 'Đã chép',
      'err.load': 'Không tải được dữ liệu từ server. Kiểm tra cửa sổ start.bat còn đang chạy không.',
      'err.notFound': 'Không tìm thấy trang này.', 'err.home': 'Về trang Module', 'loading': 'Đang tải...',
    },
    en: {
      'nav.modules': 'Modules', 'nav.cheatsheets': 'Cheatsheets', 'nav.answers': 'Answers',
      'home.title': 'Modules', 'home.sub': 'Pick a module and work through it section by section.',
      'home.empty': 'No modules yet.', 'home.emptyHint': 'Create a module in',
      'sections': 'sections', 'completed': 'Completed', 'open': 'Open module',
      'module.start': 'Start module', 'module.continue': 'Continue', 'module.review': 'Review from the start',
      'module.reset': 'Reset module', 'module.resetConfirm': 'Click again to erase progress',
      'module.resetDone': 'Module progress erased.', 'module.sections': 'Sections',
      'module.empty': 'This module has no sections yet.', 'module.emptyHint': 'Send the content to add it, or create section folders in',
      'section.prev': 'Previous section', 'section.next': 'Next section', 'section.markDone': 'Mark as complete',
      'section.done': 'Completed', 'section.undoHint': 'Click to unmark',
      'section.fallback': 'This section has no English version yet — showing the Vietnamese one.',
      'section.noContent': 'This section has no content yet.', 'section.toc': 'Module contents',
      'section.backToModule': 'Back to module', 'section.finished': 'You reached the end of this module.',
      'cs.title': 'Cheatsheets', 'cs.sub': 'Every HTB cheatsheet file — download one at a time or all at once.',
      'cs.all': 'Download all (.zip)', 'cs.view': 'View', 'cs.download': 'Download', 'cs.empty': 'No cheatsheet files yet.',
      'cs.emptyHint': 'Copy cheatsheet files into', 'cs.root': 'General', 'cs.summary': '{n} files · {size}',
      'ans.title': 'Answers', 'ans.sub': 'Answers for every section that has questions — one entry per section.',
      'ans.all': 'Download all (.md)', 'ans.module': 'Download module answers (.md)', 'ans.empty': 'No section has questions yet.',
      'ans.alt': 'Also accepted', 'ans.expand': 'Expand all', 'ans.collapse': 'Collapse all', 'ans.goto': 'Open section',
      'copy': 'Copy', 'copied': 'Copied',
      'err.load': 'Could not load data from the server. Check that the start.bat window is still running.',
      'err.notFound': 'Page not found.', 'err.home': 'Back to Modules', 'loading': 'Loading...',
    },
  };

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  }

  const esc = MiniMD.esc;
  const enc = encodeURIComponent;
  const pad = (n) => String(n).padStart(2, '0');
  const pct = (a, b) => (b ? Math.round((a * 100) / b) : 0);
  const fmtSize = (b) => (b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB');
  const encPath = (p) => p.split('/').map(enc).join('/');
  const qInline = (s) => MiniMD.inline(String(s || '').split(/(`+[^`]*`+)/).map((p, i) => (i % 2 ? p : p.replace(/\\/g, '\\\\'))).join(''));

  const ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    play: '<path d="m6 3 14 9-14 9V3z"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
  };
  const icon = (name) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  async function api(path, opts) {
    const res = await fetch(path, Object.assign({ cache: 'no-store' }, opts || {}));
    if (!res.ok) {
      let msg = res.statusText;
      try { msg = (await res.json()).error || msg; } catch (e) {}
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }
  const post = (path, body) => api(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  function progressBar(p, small) {
    return `<div class="progress${small ? ' progress-sm' : ''}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p}%"></span></div>`;
  }

  function pageHead(title, sub, actions) {
    return `<div class="page-head"><div><h1>${esc(title)}</h1>${sub ? `<p class="lead">${esc(sub)}</p>` : ''}</div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`;
  }

  function emptyState(msg, hint, path) {
    return `<div class="empty">${icon('folder')}<p>${esc(msg)}</p>${hint ? `<p class="muted">${esc(hint)} <code>${esc(path || '')}</code></p>` : ''}</div>`;
  }

  let toastTimer = null;
  function toast(msg, kind) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      document.body.appendChild(el);
    }
    el.className = 'toast show' + (kind ? ' toast-' + kind : '');
    el.innerHTML = (kind === 'ok' ? icon('check') : icon('alert')) + `<span>${esc(msg)}</span>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.className = 'toast'; }, 2600);
  }

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e2) {}
      ta.remove();
    }
    if (btn) {
      const old = btn.innerHTML;
      btn.classList.add('is-copied');
      btn.textContent = t('copied');
      setTimeout(() => { btn.innerHTML = old; btn.classList.remove('is-copied'); }, 1400);
    }
  }

  async function viewHome() {
    const mods = await api('/api/modules?lang=' + lang);
    document.title = t('home.title') + ' · ' + SITE;
    if (!mods.length) return pageHead(t('home.title'), t('home.sub')) + emptyState(t('home.empty'), t('home.emptyHint'), 'data/modules/');
    const cards = mods.map((m, i) => {
      const p = pct(m.sections_completed, m.sections_total);
      const done = m.sections_total && m.sections_completed === m.sections_total;
      return `<a class="mod-card" href="#/m/${enc(m.id)}">
        <div class="mod-card-top"><span class="eyebrow">Module ${pad(i + 1)}</span>${done ? `<span class="badge badge-ok">${icon('check')}${t('completed')}</span>` : ''}</div>
        <h2>${esc(m.title)}</h2>
        ${m.description ? `<p class="mod-desc">${esc(m.description)}</p>` : ''}
        <div class="mod-meta"><span>${icon('book')}${m.sections_total} ${t('sections')}</span></div>
        <div class="mod-progress">${progressBar(p)}<span class="pct">${p}%</span></div>
      </a>`;
    }).join('');
    return pageHead(t('home.title'), t('home.sub')) + `<div class="mod-grid">${cards}</div>`;
  }

  async function viewModule({ mid }) {
    const m = await api(`/api/modules/${enc(mid)}?lang=${lang}`);
    document.title = m.title + ' · ' + SITE;
    const p = pct(m.sections_completed, m.sections_total);
    const secs = m.sections;
    const started = secs.some((s) => s.completed);
    const allDone = secs.length && secs.every((s) => s.completed);
    const target = allDone ? secs[0] : secs.find((s) => !s.completed) || secs[0];
    const startLabel = allDone ? t('module.review') : started ? t('module.continue') : t('module.start');

    const rows = secs.map((s, i) => `
      <a class="sec-row${s.completed ? ' is-done' : ''}" href="#/m/${enc(mid)}/s/${enc(s.id)}">
        <span class="sec-num">${pad(i + 1)}</span>
        <span class="sec-title">${esc(s.title)}</span>
        <span class="sec-status" title="${s.completed ? esc(t('completed')) : ''}">${s.completed ? icon('check') : ''}</span>
      </a>`).join('');

    const html = `
      <nav class="crumbs"><a href="#/">${t('nav.modules')}</a><span>/</span><span>${esc(m.title)}</span></nav>
      <section class="mod-hero">
        <div class="mod-hero-main">
          <span class="eyebrow">Module</span>
          <h1>${esc(m.title)}</h1>
          ${m.description ? `<p class="lead">${esc(m.description)}</p>` : ''}
          <div class="mod-meta"><span>${icon('book')}${m.sections_completed}/${m.sections_total} ${t('sections')}</span></div>
          <div class="mod-progress">${progressBar(p)}<span class="pct">${p}%</span></div>
        </div>
        <div class="mod-hero-actions">
          ${target ? `<a class="btn btn-primary" href="#/m/${enc(mid)}/s/${enc(target.id)}">${icon('play')}${startLabel}</a>` : ''}
          ${started ? `<button class="btn btn-ghost" type="button" data-reset="${esc(mid)}">${icon('reset')}<span>${t('module.reset')}</span></button>` : ''}
        </div>
      </section>
      <h2 class="block-title">${icon('list')}${t('module.sections')}</h2>
      ${secs.length ? `<div class="sec-list">${rows}</div>` : emptyState(t('module.empty'), t('module.emptyHint'), m.path)}`;

    return {
      html,
      mount(root) {
        const btn = root.querySelector('[data-reset]');
        if (!btn) return;
        let armed = false, timer = null;
        btn.addEventListener('click', async () => {
          if (!armed) {
            armed = true;
            btn.classList.add('btn-danger');
            btn.querySelector('span').textContent = t('module.resetConfirm');
            timer = setTimeout(() => {
              armed = false;
              btn.classList.remove('btn-danger');
              btn.querySelector('span').textContent = t('module.reset');
            }, 3500);
            return;
          }
          clearTimeout(timer);
          try {
            await post('/api/progress/reset', { module: mid });
            toast(t('module.resetDone'), 'ok');
            render({ keepScroll: true });
          } catch (e) { toast(e.message, 'err'); }
        });
      },
    };
  }

  function sidebarHtml(mod, mid, sid) {
    const p = pct(mod.sections_completed, mod.sections_total);
    const items = mod.sections.map((s, i) => `
      <li><a class="side-item${s.id === sid ? ' is-current' : ''}${s.completed ? ' is-done' : ''}" data-sid="${esc(s.id)}" href="#/m/${enc(mid)}/s/${enc(s.id)}">
        <span class="side-dot">${s.completed ? icon('check') : i + 1}</span><span class="side-text">${esc(s.title)}</span>
      </a></li>`).join('');
    return `<details class="side-box" open>
        <summary><span class="side-label">${t('section.toc')}</span><span class="side-pct" data-side-pct>${p}%</span></summary>
        <a class="side-mod" href="#/m/${enc(mid)}">${esc(mod.title)}</a>
        <div data-side-bar>${progressBar(p, true)}</div>
        <ol class="side-list">${items}</ol>
      </details>`;
  }

  async function viewSection({ mid, sid }) {
    const d = await api(`/api/modules/${enc(mid)}/sections/${enc(sid)}?lang=${lang}`);
    document.title = d.title + ' · ' + SITE;
    const base = `/content/${enc(mid)}/${enc(sid)}/`;
    const resolve = (u) => {
      if (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(u)) return u;
      let clean = u.replace(/^\.\//, '');
      try { clean = decodeURI(clean); } catch (e) {}
      return base + encPath(clean);
    };
    const body = d.has_content
      ? MiniMD.render(d.markdown, { resolve, copyLabel: t('copy') })
      : `<div class="empty small">${icon('book')}<p>${t('section.noContent')}</p></div>`;
    const fallback = d.has_content && d.lang && d.lang !== lang ? `<div class="notice">${icon('globe')}<span>${t('section.fallback')}</span></div>` : '';

    const prev = d.prev
      ? `<a class="pager-link" href="#/m/${enc(mid)}/s/${enc(d.prev.id)}">${icon('left')}<span><small>${t('section.prev')}</small>${esc(d.prev.title)}</span></a>`
      : `<a class="pager-link" href="#/m/${enc(mid)}">${icon('left')}<span><small>${t('section.backToModule')}</small>${esc(d.module.title)}</span></a>`;
    const next = d.next
      ? `<a class="pager-link pager-next" href="#/m/${enc(mid)}/s/${enc(d.next.id)}"><span><small>${t('section.next')}</small>${esc(d.next.title)}</span>${icon('right')}</a>`
      : `<a class="pager-link pager-next" href="#/m/${enc(mid)}"><span><small>${t('section.finished')}</small>${t('section.backToModule')}</span>${icon('right')}</a>`;

    const html = `
      <div class="sec-layout">
        <aside class="sidebar">${sidebarHtml(d.module, mid, sid)}</aside>
        <article class="sec-main">
          <nav class="crumbs"><a href="#/">${t('nav.modules')}</a><span>/</span><a href="#/m/${enc(mid)}">${esc(d.module.title)}</a></nav>
          <header class="sec-head">
            <span class="eyebrow">Section ${d.index} / ${d.total}</span>
            <h1>${esc(d.title)}</h1>
          </header>
          ${fallback}
          <div class="md">${body}</div>
          <div class="sec-complete"><button type="button" class="btn ${d.completed ? 'btn-done' : 'btn-outline'}" data-complete></button></div>
          <nav class="pager">${prev}${next}</nav>
        </article>
      </div>`;

    return {
      html,
      mount(root) {
        let completed = d.completed;
        const btnDone = root.querySelector('[data-complete]');
        const sideItem = root.querySelector(`.side-item[data-sid="${CSS.escape(sid)}"]`);
        const sideIndex = d.index;

        function refreshSide() {
          const sec = d.module.sections.find((s) => s.id === sid);
          if (sec) sec.completed = completed;
          const done = d.module.sections.filter((s) => s.completed).length;
          const p = pct(done, d.module.sections.length);
          root.querySelector('[data-side-pct]').textContent = p + '%';
          root.querySelector('[data-side-bar]').innerHTML = progressBar(p, true);
          if (sideItem) {
            sideItem.classList.toggle('is-done', completed);
            sideItem.querySelector('.side-dot').innerHTML = completed ? icon('check') : String(sideIndex);
          }
        }
        function paintDone() {
          btnDone.className = 'btn ' + (completed ? 'btn-done' : 'btn-outline');
          btnDone.innerHTML = completed ? `${icon('check')}${t('section.done')}` : `${icon('check')}${t('section.markDone')}`;
          btnDone.title = completed ? t('section.undoHint') : '';
        }
        paintDone();

        btnDone.addEventListener('click', async () => {
          try {
            await post('/api/progress/section', { module: mid, section: sid, completed: !completed });
            completed = !completed;
            paintDone();
            refreshSide();
          } catch (e) { toast(e.message, 'err'); }
        });

        if (window.matchMedia('(max-width: 900px)').matches) {
          const box = root.querySelector('.side-box');
          if (box) box.open = false;
        }
      },
    };
  }

  async function viewCheatsheets() {
    const d = await api('/api/cheatsheets');
    document.title = t('cs.title') + ' · ' + SITE;
    const actions = d.total
      ? `<span class="muted">${t('cs.summary', { n: d.total, size: fmtSize(d.size) })}</span><a class="btn btn-primary" href="/download/cheatsheets.zip" download>${icon('download')}${t('cs.all')}</a>`
      : '';
    if (!d.total) return pageHead(t('cs.title'), t('cs.sub')) + emptyState(t('cs.empty'), t('cs.emptyHint'), d.path);
    const viewable = /^(pdf|png|jpe?g|gif|webp|svg|txt|md|log|csv|ya?ml|ps1|sh|py)$/i;
    const groups = d.groups.map((g) => `
      <section class="cs-group">
        <h2>${icon('folder')}<span>${esc(g.folder || t('cs.root'))}</span><span class="muted">${g.files.length}</span></h2>
        <div class="cs-list">
          ${g.files.map((f) => {
            const url = '/download/cheatsheet/' + encPath(f.path);
            return `<div class="cs-row">
              <span class="ext ext-${esc(f.ext || 'file')}">${esc((f.ext || 'file').toUpperCase().slice(0, 4))}</span>
              <span class="cs-name" title="${esc(f.path)}">${esc(f.name)}</span>
              <span class="cs-size">${fmtSize(f.size)}</span>
              <span class="cs-actions">
                ${viewable.test(f.ext) ? `<a class="btn btn-ghost btn-sm" href="${url}?view=1" target="_blank" rel="noopener">${icon('eye')}${t('cs.view')}</a>` : ''}
                <a class="btn btn-outline btn-sm" href="${url}" download>${icon('download')}${t('cs.download')}</a>
              </span>
            </div>`;
          }).join('')}
        </div>
      </section>`).join('');
    return pageHead(t('cs.title'), t('cs.sub'), actions) + groups;
  }

  async function viewAnswers() {
    const mods = (await api('/api/answers?lang=' + lang)).filter((m) => m.sections.length);
    document.title = t('ans.title') + ' · ' + SITE;
    if (!mods.length) return pageHead(t('ans.title'), t('ans.sub')) + emptyState(t('ans.empty'));
    const actions = `<button class="btn btn-ghost" type="button" data-toggle-all>${icon('list')}<span>${t('ans.collapse')}</span></button>
      <a class="btn btn-primary" href="/download/answers/_all.md?lang=${lang}" download>${icon('download')}${t('ans.all')}</a>`;
    const body = mods.map((m) => `
      <section class="ans-module">
        <div class="ans-module-head">
          <h2>${esc(m.title)}</h2>
          <a class="btn btn-outline btn-sm" href="/download/answers/${enc(m.id)}.md?lang=${lang}" download>${icon('download')}${t('ans.module')}</a>
        </div>
        ${m.sections.map((s) => `
          <details class="ans-section" open>
            <summary>
              <span class="sec-num">${pad(s.index)}</span>
              <span class="ans-title">${esc(s.title)}</span>
              <span class="chip">${icon('flag')}${s.questions.length}</span>
            </summary>
            <div class="ans-body">
              ${s.questions.map((q) => `
                <div class="ans-q">
                  <div class="ans-qtext"><span class="ans-label">Question ${q.n}:</span> ${qInline(q.text)}</div>
                  <div class="ans-a">
                    <span class="ans-arrow">==&gt;</span>
                    <code class="ans-val">${esc(q.answer)}</code>
                    <button type="button" class="icon-btn" data-copy-text="${esc(q.answer)}" title="${esc(t('copy'))}">${icon('copy')}</button>
                  </div>
                  ${q.alternatives.length ? `<div class="ans-alt">${t('ans.alt')}: ${q.alternatives.map((a) => `<code>${esc(a)}</code>`).join(' ')}</div>` : ''}
                </div>`).join('')}
              <a class="ans-goto" href="#/m/${enc(m.id)}/s/${enc(s.id)}">${t('ans.goto')}${icon('right')}</a>
            </div>
          </details>`).join('')}
      </section>`).join('');

    return {
      html: pageHead(t('ans.title'), t('ans.sub'), actions) + body,
      mount(root) {
        const btn = root.querySelector('[data-toggle-all]');
        btn.addEventListener('click', () => {
          const all = root.querySelectorAll('.ans-section');
          const anyOpen = Array.from(all).some((x) => x.open);
          all.forEach((x) => { x.open = !anyOpen; });
          btn.querySelector('span').textContent = anyOpen ? t('ans.expand') : t('ans.collapse');
        });
      },
    };
  }

  function viewNotFound() {
    document.title = SITE;
    return `<div class="empty">${icon('alert')}<p>${t('err.notFound')}</p><p><a class="btn btn-outline" href="#/">${t('err.home')}</a></p></div>`;
  }

  function parseRoute() {
    const parts = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean).map((x) => {
      try { return decodeURIComponent(x); } catch (e) { return x; }
    });
    if (!parts.length) return { name: 'home', nav: 'modules' };
    if (parts[0] === 'm' && parts.length === 2) return { name: 'module', nav: 'modules', mid: parts[1] };
    if (parts[0] === 'm' && parts.length === 4 && parts[2] === 's') return { name: 'section', nav: 'modules', mid: parts[1], sid: parts[3] };
    if (parts[0] === 'cheatsheets' && parts.length === 1) return { name: 'cheatsheets', nav: 'cheatsheets' };
    if (parts[0] === 'answers' && parts.length === 1) return { name: 'answers', nav: 'answers' };
    return { name: 'notfound' };
  }

  const VIEWS = { home: viewHome, module: viewModule, section: viewSection, cheatsheets: viewCheatsheets, answers: viewAnswers, notfound: viewNotFound };
  let token = 0;

  async function render(opts) {
    opts = opts || {};
    const route = parseRoute();
    const my = ++token;
    const scrollY = window.scrollY;
    document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('is-active', a.dataset.nav === route.nav));
    if (!opts.keepScroll) $app.innerHTML = `<div class="loading">${t('loading')}</div>`;
    let out;
    try {
      out = await VIEWS[route.name](route);
    } catch (e) {
      if (my !== token) return;
      $app.innerHTML = e.status === 404 ? viewNotFound()
        : `<div class="empty">${icon('alert')}<p>${t('err.load')}</p><p class="muted">${esc(e.message || '')}</p></div>`;
      return;
    }
    if (my !== token) return;
    const view = typeof out === 'string' ? { html: out } : out;
    $app.className = 'app view-' + route.name;
    $app.innerHTML = view.html;
    if (view.mount) view.mount($app);
    window.scrollTo(0, opts.keepScroll ? scrollY : 0);
  }

  function applyStaticI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('is-active', b.dataset.lang === lang));
  }

  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.addEventListener('click', () => {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      try { localStorage.setItem(LS_LANG, lang); } catch (e) {}
      applyStaticI18n();
      render({ keepScroll: true });
    });
  });

  document.addEventListener('click', (ev) => {
    const copyBtn = ev.target.closest('[data-copy]');
    if (copyBtn) {
      const pre = copyBtn.closest('.code').querySelector('pre').cloneNode(true);
      pre.querySelectorAll('.prompt').forEach((p) => p.remove());
      copyText(pre.textContent.replace(/\n$/, ''), copyBtn);
      return;
    }
    const copyTxt = ev.target.closest('[data-copy-text]');
    if (copyTxt) {
      copyText(copyTxt.dataset.copyText, null);
      toast(t('copied'), 'ok');
      return;
    }
    const anchor = ev.target.closest('[data-anchor], [data-anchor-id]');
    if (anchor) {
      ev.preventDefault();
      const id = anchor.dataset.anchorId || 'md-' + anchor.dataset.anchor;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  window.addEventListener('hashchange', () => render());
  applyStaticI18n();
  render();
})();
