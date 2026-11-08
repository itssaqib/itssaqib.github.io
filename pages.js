/* =========================================================
   Research · Teaching · Resources — small page enhancements
   (runs after scripts.js; everything degrades gracefully)
   ========================================================= */

(function () {

  /* ---------- Abstract buttons: proper button type + aria state ---------- */
  function prepAbstracts() {
    document.querySelectorAll('.abstract-toggle').forEach((btn) => {
      btn.setAttribute('type', 'button');
      if (!btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', 'false');
    });
  }

  /* ---------- Resources: live search ---------- */
  function resourceSearch() {
    const input = document.getElementById('resourceSearch');
    if (!input) return;
    const cards = Array.from(document.querySelectorAll('.res-card'));
    const blocks = Array.from(document.querySelectorAll('.res-block'));
    const empty = document.querySelector('.no-results');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      cards.forEach((c) => {
        c.hidden = !!q && !c.textContent.toLowerCase().includes(q);
      });
      let any = false;
      blocks.forEach((b) => {
        const visible = b.querySelectorAll('.res-card:not([hidden])').length > 0;
        b.hidden = !visible;
        if (visible) any = true;
      });
      if (empty) empty.style.display = any ? 'none' : 'block';
    });
  }

  /* ---------- Resources: show the website name next to each link ---------- */
  function resourceHosts() {
    document.querySelectorAll('.res-card').forEach((c) => {
      const host = c.querySelector('.res-host');
      if (!host || host.textContent.trim()) return;
      try { host.textContent = new URL(c.href).hostname.replace(/^www\./, ''); } catch (e) { /* ignore */ }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    resourceHosts();
    resourceSearch();
  });

  // Research content is fetched; prepare buttons when it arrives
  document.addEventListener('includes:loaded', prepAbstracts);
})();
