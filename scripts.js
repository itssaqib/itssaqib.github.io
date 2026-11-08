/* =========================================================
   Saqib Hussain — shared site script
   ========================================================= */

/* ---------- Theme (remembered across pages) ---------- */
const THEME_KEY = 'theme';

function readSavedTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = isDark ? '🌞' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function toggleTheme() {
  const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
}

// Apply as early as possible to avoid a light flash
applyTheme(readSavedTheme());

/* ---------- Home page: Read More ---------- */
function toggleBio(btn) {
  const extraBio = document.querySelector('.extra-bio');
  if (!extraBio) return;
  const open = extraBio.classList.toggle('show');
  const button = btn || document.querySelector('.bio-text .expand-btn');
  if (button) button.textContent = open ? 'Read Less' : 'Read More';
}

/* ---------- Helpers ---------- */
function openLink(url) {
  window.open(url, '_blank', 'noopener');
}

function copyEmail(event, element) {
  event.preventDefault();
  const email = 'saqibhussain@kdis.ac.kr';
  const tooltip = element.parentElement.querySelector('.tooltip-text');

  const showTip = () => {
    if (!tooltip) return;
    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 1200);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(showTip).catch(() => {
      window.location.href = 'mailto:' + email;
    });
  } else {
    // Clipboard API not available (e.g. http or file://) -> open mail app
    window.location.href = 'mailto:' + email;
  }
}

/* ---------- Abstract toggles (event delegation, works for loaded content) ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.abstract-toggle');
  if (!btn) return;
  const paper = btn.closest('.paper');
  const box = paper && paper.querySelector('.abstract-box');
  if (box) {
    const open = box.classList.toggle('show');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
});

/* ---------- HTML includes ---------- */
function loadInto(el, url) {
  if (!el) return Promise.resolve();
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      return res.text();
    })
    .then((html) => { el.innerHTML = html; })
    .catch((err) => console.error('Error loading ' + url + ':', err));
}

function highlightActiveNav() {
  let currentPage = location.pathname.split('/').pop();
  if (!currentPage) currentPage = 'index.html';
  document.querySelectorAll('nav a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Header + active nav link
  loadInto(document.getElementById('header-placeholder'), 'header.html')
    .then(highlightActiveNav);

  // Footer (only on pages that have the placeholder)
  loadInto(document.getElementById('footer-placeholder'), 'footer.html');

  // Any element with data-include="path/to/file.html"
  const includes = Array.from(document.querySelectorAll('[data-include]'))
    .map((el) => loadInto(el, el.getAttribute('data-include')));

  // Let page scripts know when all included content is in the DOM
  Promise.all(includes).then(() => {
    document.dispatchEvent(new CustomEvent('includes:loaded'));
  });

  // Custom cursor glow
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }
});
