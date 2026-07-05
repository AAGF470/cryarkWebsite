/* Sidebar behavior — shared across pages.
   1) collapse toggle (persisted in localStorage)
   2) document outline: on any page with a `.prose` article, the sidebar's
      blank space fills with the section headings (Google-Docs style), with
      smooth scroll + scroll-spy active highlighting. */
(function () {
  const shell = document.querySelector('.shell');
  const toggle = document.querySelector('.side__toggle');

  // ── collapse ──────────────────────────────────────────────────────────
  if (shell && toggle) {
    const setState = (collapsed) => {
      shell.classList.toggle('collapsed', collapsed);
      toggle.textContent = collapsed ? '›' : '‹'; // › / ‹
      toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    };
    setState(localStorage.getItem('gs-side-collapsed') === '1');
    toggle.addEventListener('click', () => {
      const next = !shell.classList.contains('collapsed');
      setState(next);
      localStorage.setItem('gs-side-collapsed', next ? '1' : '0');
    });
  }

  // ── document outline ──────────────────────────────────────────────────
  const heads = Array.prototype.slice.call(document.querySelectorAll('.prose h2'));
  const outline = document.querySelector('.side__outline');
  const toc = document.querySelector('.side__toc');
  if (!heads.length || !outline || !toc) return;

  outline.hidden = false;
  const links = heads.map(function (h, i) {
    if (!h.id) h.id = 'sec-' + (i + 1);
    // strip the kicker span (e.g. "№ 1 — Strategy") — keep the heading proper
    const clone = h.cloneNode(true);
    const kicker = clone.querySelector('.no');
    if (kicker) kicker.remove();
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.className = 'toc-link';
    a.textContent = clone.textContent.trim();
    a.title = a.textContent;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + h.id);
    });
    toc.appendChild(a);
    return a;
  });

  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      links.forEach(function (l) {
        l.classList.toggle('on', l.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-12% 0px -70% 0px', threshold: 0 });
  heads.forEach(function (h) { spy.observe(h); });
})();
