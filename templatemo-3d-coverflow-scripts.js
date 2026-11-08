/*
  3D coverflow gallery (Fieldwork page)
  Based on TemplateMo 595 3d coverflow — https://templatemo.com/tm-595-3d-coverflow

  Titles/descriptions come from each .coverflow-item's
  data-title / data-description attributes in field.html.
*/

(function () {
  const items = Array.from(document.querySelectorAll('.coverflow-item'));
  const container = document.querySelector('.coverflow-container');
  if (!items.length || !container) return;

  const dotsContainer = document.getElementById('dots');
  const currentTitle = document.getElementById('current-title');
  const currentDescription = document.getElementById('current-description');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  const prevBtn = document.querySelector('.nav-button.prev');
  const nextBtn = document.querySelector('.nav-button.next');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  let currentIndex = Math.min(3, items.length - 1);
  let isAnimating = false;
  let autoplayInterval = null;
  let isPlaying = false;

  // Create dots
  const dots = items.map((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', 'Show photo ' + (index + 1));
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToIndex(index);
    });
    if (dotsContainer) dotsContainer.appendChild(dot);
    return dot;
  });

  function updateCoverflow() {
    isAnimating = true;

    items.forEach((item, index) => {
      let offset = index - currentIndex;
      if (offset > items.length / 2) offset -= items.length;
      else if (offset < -items.length / 2) offset += items.length;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      let translateX = offset * 220;
      const translateZ = -absOffset * 200;
      const rotateY = -sign * Math.min(absOffset * 60, 60);
      let opacity = 1 - absOffset * 0.2;
      const scale = 1 - absOffset * 0.1;

      if (absOffset > 3) {
        opacity = 0;
        translateX = sign * 800;
      }

      item.style.transform =
        `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = 100 - absOffset;
      item.classList.toggle('active', index === currentIndex);
    });

    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));

    const active = items[currentIndex];
    if (currentTitle) currentTitle.textContent = active.dataset.title || '';
    if (currentDescription) currentDescription.textContent = active.dataset.description || '';

    [currentTitle, currentDescription].forEach((el) => {
      if (!el) return;
      el.style.animation = 'none';
      void el.offsetWidth; // restart animation
      el.style.animation = 'fadeIn 0.6s forwards';
    });

    setTimeout(() => { isAnimating = false; }, 600);
  }

  function navigate(direction) {
    if (isAnimating) return;
    currentIndex = (currentIndex + direction + items.length) % items.length;
    updateCoverflow();
  }

  function goToIndex(index) {
    if (isAnimating || index === currentIndex) return;
    currentIndex = index;
    updateCoverflow();
  }

  // Autoplay
  function setPlayIcons() {
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
  }

  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % items.length;
      updateCoverflow();
    }, 4000);
    isPlaying = true;
    setPlayIcons();
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
    isPlaying = false;
    setPlayIcons();
  }

  function toggleAutoplay() {
    if (isPlaying) stopAutoplay();
    else startAutoplay();
  }

  // Buttons
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); navigate(-1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); navigate(1); });
  if (playPauseBtn) playPauseBtn.addEventListener('click', toggleAutoplay);

  // Click on an item to select it
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      stopAutoplay();
      goToIndex(index);
    });
  });

  // Keyboard navigation
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { stopAutoplay(); navigate(-1); }
    if (e.key === 'ArrowRight') { stopAutoplay(); navigate(1); }
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) e.preventDefault();
  }, { passive: false });

  container.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const diffX = touchStartX - e.changedTouches[0].screenX;
    const diffY = touchStartY - e.changedTouches[0].screenY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      stopAutoplay();
      navigate(diffX > 0 ? 1 : -1);
    }
  }, { passive: true });

  // Images + reflections (also handles images that were already cached)
  items.forEach((item) => {
    const img = item.querySelector('img');
    const reflection = item.querySelector('.reflection');
    if (!img) return;

    const onLoad = () => {
      img.parentElement.classList.remove('image-loading');
      if (reflection) reflection.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    };

    if (img.complete && img.naturalWidth > 0) onLoad();
    else {
      img.addEventListener('load', onLoad);
      img.addEventListener('error', () => img.parentElement.classList.add('image-loading'));
    }
  });

  // Scroll-to-top button
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      scrollToTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Initialize
  updateCoverflow();
  startAutoplay();
})();
